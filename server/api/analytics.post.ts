import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { serverSupabaseUser } from "#supabase/server/serverSupabaseUser";

const allowed = new Set(["page_view", "cv_click"]);

export default defineEventHandler(async (event) => {
  const body = await readBody<{ type?: string; path?: string }>(event);
  if (!body?.type || !allowed.has(body.type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid analytics event" });
  }
  const path = String(body.path || "/").slice(0, 300);
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/dashboard") || path.startsWith("/api/")) return { ok: true, ignored: true };
  const config = useRuntimeConfig(event);
  const user = await serverSupabaseUser(event);
  if (user?.sub && user.sub === config.adminUserId) return { ok: true, ignored: true };
  if (!config.supabaseServiceRoleKey || !process.env.SUPABASE_URL) throw createError({ statusCode: 503, statusMessage: "Analytics unavailable" });
  let sessionId = getCookie(event, "portfolio_analytics_session");
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
    sessionId = randomUUID();
    setCookie(event, "portfolio_analytics_session", sessionId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await supabase.rpc("record_portfolio_event", { p_event_type: body.type, p_path: path, p_session_id: sessionId });
  if (error) throw createError({ statusCode: 503, statusMessage: "Analytics could not be saved" });
  return { ok: true };
});

