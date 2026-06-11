import { db, enforcementDecision, gatewayDeployment, apiKey, approvalRequest } from "@traject/database";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

const apiKeyGuard = (app: Elysia) =>
  app.derive(async ({ request, set }) => {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) {
      set.status = 401;
      return { apiKeyAuth: null as { id: string; organizationId: string; isActive: boolean } | null };
    }

    const key = header.slice(7);

    const found = await db
      .select({ id: apiKey.id, organizationId: apiKey.organizationId, isActive: apiKey.isActive })
      .from(apiKey)
      .where(eq(apiKey.keyHash, key))
      .limit(1);

    if (!found.length || !found[0]?.isActive) {
      set.status = 401;
      return { apiKeyAuth: null };
    }

    return { apiKeyAuth: found[0] };
  });

const decisionSchema = t.Object({
  toolName: t.String(),
  verdict: t.String(),
  reason: t.Optional(t.String()),
  latencyUs: t.Optional(t.Number()),
  trajectoryRef: t.Optional(t.String()),
  payload: t.Optional(t.Any()),
  compiledGraphId: t.Optional(t.String()),
  deploymentId: t.Optional(t.String()),
});

export const enforcementModule = new Elysia({ prefix: "/enforcement" })
  .get(
    "/decisions",
    async ({ query }) => {
      const rows = await db
        .select()
        .from(enforcementDecision)
        .orderBy(desc(enforcementDecision.createdAt))
        .limit(200);

      return rows;
    },
    {
      detail: {
        tags: ["Enforcement"],
        summary: "List enforcement decisions",
        description: "Returns recent enforcement decisions for the dashboard.",
      },
    },
  )
  .get(
    "/deployments",
    async () => {
      const rows = await db
        .select()
        .from(gatewayDeployment)
        .orderBy(desc(gatewayDeployment.updatedAt))
        .limit(100);

      return rows;
    },
    {
      detail: {
        tags: ["Enforcement"],
        summary: "List gateway deployments",
        description: "Returns all registered gateway deployments.",
      },
    },
  )
  .get(
    "/stats",
    async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [[decisionsToday], [blockedToday], [onlineDeployments], [pendingApprovals]] =
        await Promise.all([
          db
            .select({ count: sql<number>`count(*)` })
            .from(enforcementDecision)
            .where(gte(enforcementDecision.createdAt, todayStart)),
          db
            .select({ count: sql<number>`count(*)` })
            .from(enforcementDecision)
            .where(
              and(
                gte(enforcementDecision.createdAt, todayStart),
                eq(enforcementDecision.verdict, "BLOCK"),
              ),
            ),
          db
            .select({ count: sql<number>`count(*)` })
            .from(gatewayDeployment)
            .where(eq(gatewayDeployment.status, "ONLINE")),
          db
            .select({ count: sql<number>`count(*)` })
            .from(approvalRequest)
            .where(eq(approvalRequest.status, "PENDING")),
        ]);

      return {
        decisionsToday: Number(decisionsToday?.count ?? 0),
        blockRate: Number(blockedToday?.count ?? 0),
        onlineDeployments: Number(onlineDeployments?.count ?? 0),
        pendingApprovals: Number(pendingApprovals?.count ?? 0),
      };
    },
    {
      detail: {
        tags: ["Enforcement"],
        summary: "Enforcement stats",
        description: "Aggregate counts for the dashboard overview.",
      },
    },
  )
  .use(apiKeyGuard)
  .post(
    "/decisions",
    async ({ body, apiKeyAuth, set }) => {
      if (!apiKeyAuth) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const decisions = Array.isArray(body) ? body : [body];
      const rows = decisions.map((d) => ({
        organizationId: apiKeyAuth.organizationId,
        deploymentId: d.deploymentId ?? null,
        compiledGraphId: d.compiledGraphId ?? null,
        toolName: d.toolName,
        verdict: d.verdict,
        reason: d.reason ?? null,
        latencyUs: d.latencyUs ?? null,
        trajectoryRef: d.trajectoryRef ?? null,
        payload: d.payload ?? null,
      }));

      await db.insert(enforcementDecision).values(rows);

      return { inserted: rows.length };
    },
    {
      body: t.Union([decisionSchema, t.Array(decisionSchema)]),
      detail: {
        tags: ["Enforcement"],
        summary: "Ingest enforcement decisions",
        description:
          "Batch insert of allow/block/ask/warn decisions from trajectoryd. Fire-and-forget.",
      },
    },
  )
  .post(
    "/deployments/:id/heartbeat",
    async ({ params, apiKeyAuth, set }) => {
      if (!apiKeyAuth) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const now = new Date();
      const threshold = new Date(now.getTime() - 30_000);

      await db
        .update(gatewayDeployment)
        .set({
          lastHeartbeatAt: now,
          status: sql`CASE WHEN ${gatewayDeployment.lastHeartbeatAt} IS NULL OR ${gatewayDeployment.lastHeartbeatAt} < ${threshold} THEN 'ONLINE' ELSE ${gatewayDeployment.status} END`,
          updatedAt: now,
        })
        .where(eq(gatewayDeployment.id, params.id));

      return { ok: true };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Enforcement"],
        summary: "Gateway heartbeat",
        description: "Updates deployment heartbeat and recomputes status.",
      },
    },
  );
