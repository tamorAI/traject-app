import * as z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  API_URL: z.string().default("http://localhost:8001"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  DEMO_REQUEST_EMAIL: z.string().optional(),
});

function getEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (parsed.success) return parsed.data;

  return {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV:
      (process.env.NODE_ENV as "development" | "production") ?? "development",
    API_URL: process.env.API_URL ?? "http://localhost:8001",
    SMTP_HOST: process.env.SMTP_HOST ?? "",
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_SECURE: process.env.SMTP_SECURE ?? "false",
    SMTP_USER: process.env.SMTP_USER ?? "",
    SMTP_PASS: process.env.SMTP_PASS ?? "",
    SMTP_FROM: process.env.SMTP_FROM ?? "noreply@trajeckt.com",
    DEMO_REQUEST_EMAIL: process.env.DEMO_REQUEST_EMAIL ?? "hello@trajeckt.com",
  };
}

export const ENV = getEnv();
export const hasEnvVars = envSchema.safeParse(process.env);
