import { createClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

export async function requirePortfolioAdmin(event: H3Event) {
  const config = useRuntimeConfig(event);
  const user = await serverSupabaseUser(event);
  if (!user || !config.adminUserId || user.id !== config.adminUserId) {
    throw createError({ statusCode: 403, statusMessage: "Administrator access required" });
  }
  if (!config.supabaseServiceRoleKey || !process.env.SUPABASE_URL) {
    throw createError({ statusCode: 503, statusMessage: "Supabase server configuration is incomplete" });
  }
  return createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
