import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const { data, error } = await supabase.from("portfolio_projects").select("*").order("sort_order");
  if (error) throw createError({ statusCode: 503, statusMessage: "Projects could not be loaded" });
  return data || [];
});
