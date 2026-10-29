import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.from("portfolio_articles").select("id,slug,title,excerpt,content,category,image_url,image_urls,status,published_at,created_at,updated_at").eq("slug", slug).eq("status", "Published").maybeSingle();
  if (error) throw createError({ statusCode: 503, statusMessage: "Article is temporarily unavailable" });
  if (!data) throw createError({ statusCode: 404, statusMessage: "Article not found" });
  return data;
});
