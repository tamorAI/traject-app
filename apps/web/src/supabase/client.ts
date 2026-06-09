import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./supabase";
import { ENV } from "@/lib/env";

export const supabaseClient = createBrowserClient<Database>(
  ENV.NEXT_PUBLIC_SUPABASE_URL,
  ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
