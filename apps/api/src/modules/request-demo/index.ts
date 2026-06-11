import { db, demoRequest } from "@traject/database";
import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });
}

const createSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  company: t.Optional(t.String()),
  message: t.Optional(t.String()),
});

const updateSchema = t.Object({
  status: t.Union([
    t.Literal("PENDING"),
    t.Literal("CONTACTED"),
    t.Literal("QUALIFIED"),
    t.Literal("CLOSED"),
  ]),
});

export const requestDemoModule = new Elysia({ prefix: "/request-demo" })
  .post(
    "/",
    async ({ body, set }) => {
      const [row] = await db
        .insert(demoRequest)
        .values({
          name: body.name,
          email: body.email,
          company: body.company ?? null,
          message: body.message ?? null,
        })
        .returning();

      const transporter = createTransport();
      if (transporter) {
        await transporter.sendMail({
          from: `"${body.name}" <${process.env.SMTP_FROM ?? "noreply@trajeckt.com"}>`,
          to: process.env.DEMO_REQUEST_EMAIL ?? "hello@trajeckt.com",
          subject: `Demo Request from ${body.name}${body.company ? ` · ${body.company}` : ""}`,
          html: `
            <table style="width:100%;max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
              <tr><td style="padding:32px 0 16px"><h1 style="font-size:20px;font-weight:600;margin:0">New Demo Request</h1></td></tr>
              <tr><td style="padding:4px 0"><strong style="color:#555">Name</strong><br/>${body.name}</td></tr>
              <tr><td style="padding:4px 0"><strong style="color:#555">Email</strong><br/>${body.email}</td></tr>
              ${body.company ? `<tr><td style="padding:4px 0"><strong style="color:#555">Company</strong><br/>${body.company}</td></tr>` : ""}
              ${body.message ? `<tr><td style="padding:4px 0"><strong style="color:#555">Message</strong><br/>${body.message}</td></tr>` : ""}
            </table>
          `,
        });
      }

      return { success: true, id: row!.id };
    },
    {
      body: createSchema,
      detail: {
        tags: ["Request Demo"],
        summary: "Submit a demo request",
        description: "Stores the request in the database and sends an email notification.",
      },
    },
  )
  .get(
    "/",
    async () => {
      const rows = await db
        .select()
        .from(demoRequest)
        .orderBy(desc(demoRequest.createdAt))
        .limit(100);

      return rows;
    },
    {
      detail: {
        tags: ["Request Demo"],
        summary: "List demo requests",
        description: "Returns all demo requests, newest first.",
      },
    },
  )
  .patch(
    "/",
    async ({ query, body, set }) => {
      const id = query.id;
      if (!id) {
        set.status = 400;
        return { error: "Missing id" };
      }

      const [row] = await db
        .update(demoRequest)
        .set({ status: body.status })
        .where(eq(demoRequest.id, id))
        .returning();

      if (!row) {
        set.status = 404;
        return { error: "Not found" };
      }

      return row;
    },
    {
      query: t.Object({ id: t.String() }),
      body: updateSchema,
      detail: {
        tags: ["Request Demo"],
        summary: "Update demo request status",
        description: "Updates the status of a demo request (PENDING / CONTACTED / QUALIFIED / CLOSED).",
      },
    },
  )
  .delete(
    "/",
    async ({ query, set }) => {
      const id = query.id;
      if (!id) {
        set.status = 400;
        return { error: "Missing id" };
      }

      const [row] = await db
        .delete(demoRequest)
        .where(eq(demoRequest.id, id))
        .returning();

      if (!row) {
        set.status = 404;
        return { error: "Not found" };
      }

      return { deleted: true };
    },
    {
      query: t.Object({ id: t.String() }),
      detail: {
        tags: ["Request Demo"],
        summary: "Delete a demo request",
        description: "Deletes a demo request by id.",
      },
    },
  );
