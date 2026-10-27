import { requirePortfolioAdmin } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", getRouterParam(event, "id")!);
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return { ok: true };
});
