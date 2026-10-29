import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const { data, error } = await supabase.from("portfolio_articles").select("*").order("updated_at", { ascending: false });
  if (error) throw createError({ statusCode: 503, statusMessage: "Articles are unavailable. Apply the articles migration." });
  return data || [];
});
