import { db, approvalRequest, operatorToken } from "@traject/database";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

const operatorTokenGuard = (app: Elysia) =>
  app.derive(async ({ request, set }) => {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) {
      set.status = 401;
      return { operatorAuth: null as { id: string; organizationId: string; scopes: string[] | null; isActive: boolean } | null };
    }

    const token = header.slice(7);

    const found = await db
      .select({
        id: operatorToken.id,
        organizationId: operatorToken.organizationId,
        scopes: operatorToken.scopes,
        isActive: operatorToken.isActive,
      })
      .from(operatorToken)
      .where(eq(operatorToken.tokenHash, token))
      .limit(1);

    if (!found.length || !found[0]?.isActive) {
      set.status = 401;
      return { operatorAuth: null };
    }

    const scopes = found[0].scopes ?? [];
    if (!scopes.includes("approvals:resolve")) {
      set.status = 403;
      return { operatorAuth: null };
    }

    return { operatorAuth: found[0] };
  });

export const approvalsModule = new Elysia({ prefix: "/approvals" })
  .get(
    "/",
    async ({ query, set }) => {
      const status = query.status ?? "PENDING";
      const rows = await db
        .select()
        .from(approvalRequest)
        .where(eq(approvalRequest.status, status))
        .orderBy(approvalRequest.createdAt)
        .limit(100);

      return rows;
    },
    {
      query: t.Object({
        status: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Approvals"],
        summary: "List approval requests",
        description: "Returns approval requests, optionally filtered by status.",
      },
    },
  )
  .use(operatorTokenGuard)
  .post(
    "/:id/resolve",
    async ({ params, body, operatorAuth, set }) => {
      if (!operatorAuth) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const now = new Date();
      const newStatus = body.verdict === "approve" ? "APPROVED" : "DENIED";

      await db
        .update(approvalRequest)
        .set({
          status: newStatus,
          resolvedByToken: operatorAuth.id,
          resolvedAt: now,
          updatedAt: now,
        })
        .where(
          and(
            eq(approvalRequest.id, params.id),
            eq(approvalRequest.status, "PENDING"),
          ),
        );

      return { resolved: true, verdict: newStatus };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        verdict: t.Union([t.Literal("approve"), t.Literal("deny")]),
      }),
      detail: {
        tags: ["Approvals"],
        summary: "Resolve an approval request",
        description:
          "Approve or deny a pending approval. Requires operator token with approvals:resolve scope.",
      },
    },
  );
