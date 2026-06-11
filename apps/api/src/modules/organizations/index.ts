import { db, organization, userOrganization } from "@traject/database";
import { eq, and } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { withAuth } from "@/middleware/auth-guard";

export const organizationsModule = new Elysia({ prefix: "/api/organizations" })
  .use(withAuth)
  .get(
    "/",
    async ({ user: authUser, set }) => {
      if (!authUser) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const rows = await db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logoUrl: organization.logoUrl,
          role: userOrganization.role,
        })
        .from(userOrganization)
        .innerJoin(
          organization,
          eq(userOrganization.organizationId, organization.id),
        )
        .where(
          and(
            eq(userOrganization.userId, authUser.id),
            eq(organization.isActive, true),
          ),
        )
        .orderBy(organization.name);

      return rows;
    },
    {
      auth: true,
      detail: {
        tags: ["Organizations"],
        summary: "List user organizations",
        description:
          "Returns all organizations the authenticated user belongs to.",
      },
    },
  );
