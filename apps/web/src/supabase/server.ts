import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./supabase";
import { ENV } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    ENV.NEXT_PUBLIC_SUPABASE_URL,
    ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component where cookies() cannot be modified.
            // This is fine — the cookie will be set on the next request if needed.
          }
        },
      },
    },
  );
}
