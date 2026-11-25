import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) {
    throw createError({ statusCode: 400, statusMessage: "Invalid article slug" });
  }

  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.rpc("record_portfolio_article_read", { p_slug: slug });
  if (error) {
    throw createError({ statusCode: error.code === "P0002" ? 404 : 503, statusMessage: "Article read could not be counted" });
  }
  return { readCount: data };
});
