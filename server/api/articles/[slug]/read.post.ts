import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) {
    throw createError({ statusCode: 400, statusMessage: "Invalid article slug" });
  }

  const config = useRuntimeConfig(event);
  if (!config.supabaseServiceRoleKey || !process.env.SUPABASE_URL) throw createError({ statusCode: 503, statusMessage: "Read count is unavailable" });
  let sessionId = getCookie(event, "portfolio_read_session");
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
    sessionId = randomUUID();
    setCookie(event, "portfolio_read_session", sessionId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.rpc("record_portfolio_article_read", { p_slug: slug, p_session: sessionId });
  if (error) {
    throw createError({ statusCode: error.code === "P0002" ? 404 : 503, statusMessage: "Article read could not be counted" });
  }
  return { readCount: data };
});
