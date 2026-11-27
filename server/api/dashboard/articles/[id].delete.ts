import { requirePortfolioAdmin } from "../../../utils/admin";
import { extractArticleImageUrls, removeUnreferencedPortfolioFiles } from "../../../utils/media-cleanup";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const { data, error } = await supabase.from("portfolio_articles").delete().eq("id", id).select("image_url,image_urls,content").single();
  if (error || !data) throw createError({ statusCode: 404, statusMessage: "Article not found" });
  await removeUnreferencedPortfolioFiles(supabase, [data.image_url, ...data.image_urls, ...extractArticleImageUrls(data.content)]);
  return { ok: true };
});
