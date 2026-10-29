import { requirePortfolioAdmin } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const { error } = await supabase.from("portfolio_articles").delete().eq("id", id);
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return { ok: true };
});
