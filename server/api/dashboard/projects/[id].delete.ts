import { requirePortfolioAdmin } from "../../../utils/admin";
import { removeUnreferencedPortfolioFiles } from "../../../utils/media-cleanup";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const { data, error } = await supabase.from("portfolio_projects").delete().eq("id", getRouterParam(event, "id")!).select("image_url").single();
  if (error || !data) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  await removeUnreferencedPortfolioFiles(supabase, [data.image_url]);
  return { ok: true };
});
