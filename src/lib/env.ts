import * as z from "zod";

const envSchema = z.object({
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
});

/**
 * ENVIRONMENT OBJECT PASSED OVER MODULES AND FILES
 */
export const ENV = envSchema.parse(process.env);
export const hasEnvVars = envSchema.safeParse(process.env);
