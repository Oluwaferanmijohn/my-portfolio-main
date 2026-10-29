import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.from("portfolio_articles").select("id,slug,title,excerpt,content,category,image_url,image_urls,status,published_at,created_at,updated_at").eq("status", "Published").order("published_at", { ascending: false });
  if (error) throw createError({ statusCode: 503, statusMessage: "Articles are not available yet. Apply the articles migration." });
  return data || [];
});
