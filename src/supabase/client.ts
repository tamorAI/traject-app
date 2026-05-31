import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";
import { ENV } from "@/lib/env";

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
};

export const supabaseClient = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  options,
);
