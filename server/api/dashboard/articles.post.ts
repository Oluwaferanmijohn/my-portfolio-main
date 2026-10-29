import { requirePortfolioAdmin } from "../../utils/admin";
import { buildArticlePayload } from "../../utils/article";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<Record<string, unknown>>(event);
  const article = buildArticlePayload(body);
  const { data, error } = await supabase.from("portfolio_articles").insert(article).select().single();
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return data;
});
