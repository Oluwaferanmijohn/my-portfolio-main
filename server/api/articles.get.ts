import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const page = Number(getQuery(event).page ?? 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000) throw createError({ statusCode: 400, statusMessage: "Invalid article page" });
  const pageSize = 9;
  const from = (page - 1) * pageSize;
  const supabase = await serverSupabaseClient(event);
  const { count, error: countError } = await supabase.from("portfolio_articles").select("id", { count: "exact", head: true }).eq("status", "Published");
  if (countError) throw createError({ statusCode: 503, statusMessage: "Articles are temporarily unavailable." });
  if (from >= (count || 0)) return { articles: [], total: count || 0, page, pageSize };
  const { data, error } = await supabase.from("portfolio_articles")
    .select("id,slug,title,excerpt,category,image_url,read_count,published_at")
    .eq("status", "Published").order("published_at", { ascending: false }).range(from, from + pageSize - 1);
  if (error) throw createError({ statusCode: 503, statusMessage: "Articles are temporarily unavailable." });
  return { articles: data || [], total: count || 0, page, pageSize };
});
