import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<{ endpoint?: string }>(event);
  if (!body?.endpoint || !/^https:\/\//i.test(body.endpoint)) throw createError({ statusCode: 400, statusMessage: "Invalid push subscription endpoint" });
  const { error } = await supabase.from("portfolio_push_subscriptions").delete().eq("endpoint", body.endpoint);
  if (error) throw createError({ statusCode: 400, statusMessage: "Could not remove this device's notification subscription" });
  return { ok: true };
});
