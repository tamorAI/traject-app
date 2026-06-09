import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const requestDemoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().optional(),
});

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestDemoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, company, message } = parsed.data;
    const transporter = createTransport();

    if (transporter) {
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_FROM ?? "noreply@trajeckt.com"}>`,
        to: process.env.DEMO_REQUEST_EMAIL ?? "hello@trajeckt.com",
        subject: `Demo Request from ${name}${company ? ` · ${company}` : ""}`,
        html: `
          <table style="width:100%;max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
            <tr><td style="padding:32px 0 16px"><h1 style="font-size:20px;font-weight:600;margin:0">New Demo Request</h1></td></tr>
            <tr><td style="padding:4px 0"><strong style="color:#555">Name</strong><br/>${name}</td></tr>
            <tr><td style="padding:4px 0"><strong style="color:#555">Email</strong><br/>${email}</td></tr>
            ${company ? `<tr><td style="padding:4px 0"><strong style="color:#555">Company</strong><br/>${company}</td></tr>` : ""}
            ${message ? `<tr><td style="padding:4px 0"><strong style="color:#555">Message</strong><br/>${message}</td></tr>` : ""}
          </table>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: { form: ["Failed to send request. Please try again."] } },
      { status: 500 },
    );
  }
}
