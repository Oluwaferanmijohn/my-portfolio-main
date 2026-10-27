import { serverSupabaseClient } from "#supabase/server";

const allowed = new Set(["page_view", "cv_click", "contact_sent"]);

export default defineEventHandler(async (event) => {
  const body = await readBody<{ type?: string; path?: string; sessionId?: string }>(event);
  if (!body?.type || !allowed.has(body.type) || !body.sessionId || body.sessionId.length < 12 || body.sessionId.length > 80) {
    throw createError({ statusCode: 400, statusMessage: "Invalid analytics event" });
  }
  const path = String(body.path || "/").slice(0, 300);
  const supabase = await serverSupabaseClient(event);
  const { error } = await supabase.rpc("record_portfolio_event", { p_event_type: body.type, p_path: path, p_session_id: body.sessionId });
  if (error) throw createError({ statusCode: 503, statusMessage: "Analytics could not be saved" });
  return { ok: true };
});

