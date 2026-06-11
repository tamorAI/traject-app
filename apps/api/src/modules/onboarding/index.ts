import { db, organization, userOrganization, user } from "@traject/database";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { withAuth } from "@/middleware/auth-guard";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || `org-${Date.now()}`;
}

const completeSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 128 }),
  slug: t.Optional(t.String({ pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" })),
});

export const onboardingModule = new Elysia({ prefix: "/api/onboarding" })
  .use(withAuth)
  .post(
    "/complete",
    async ({ body, user: authUser, set }) => {
      if (!authUser) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const slug = body.slug || slugify(body.name);

      const existingOrg = await db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.slug, slug))
        .limit(1);

      if (existingOrg.length > 0) {
        set.status = 409;
        return { error: "An organization with this slug already exists" };
      }

      const [org] = await db.transaction(async (tx) => {
        const [createdOrg] = await tx
          .insert(organization)
          .values({ name: body.name, slug })
          .returning();

        await tx.insert(userOrganization).values({
          userId: authUser.id,
          organizationId: createdOrg!.id,
          role: "OWNER",
          isDefault: true,
        });

        await tx
          .update(user)
          .set({ onboardingCompleted: true })
          .where(eq(user.id, authUser.id));

        return [createdOrg];
      });

      return { organization: org };
    },
    {
      body: completeSchema,
      auth: true,
      detail: {
        tags: ["Onboarding"],
        summary: "Complete onboarding",
        description:
          "Creates the user's first organization and marks onboarding as complete.",
      },
    },
  );
