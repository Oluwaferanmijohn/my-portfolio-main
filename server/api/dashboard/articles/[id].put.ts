import { requirePortfolioAdmin } from "../../../utils/admin";
import { buildArticlePayload } from "../../../utils/article";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const body = await readBody<Record<string, unknown>>(event);
  const { data: current, error: readError } = await supabase.from("portfolio_articles").select("published_at").eq("id", id).single();
  if (readError || !current) throw createError({ statusCode: 404, statusMessage: "Article not found" });
  const article = buildArticlePayload(body, current.published_at);
  const { data, error } = await supabase.from("portfolio_articles").update(article).eq("id", id).select().single();
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return data;
});
