import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set — add it to your .env file " +
      "(never expose it to the client; never use NEXT_PUBLIC_ prefix).",
  );
}

/**
 * Supabase admin client using the service-role key.
 *
 * Bypasses RLS entirely — use ONLY in server-only contexts
 * (API routes, server actions, server components).
 * Never import this in client components.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
