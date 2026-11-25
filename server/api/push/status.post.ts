import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const { endpoint } = await readBody<{ endpoint?: string }>(event);
  const adminUserId = useRuntimeConfig(event).adminUserId;
  const { data, error } = await supabase
    .from("portfolio_push_subscriptions")
    .select("endpoint")
    .eq("user_id", adminUserId);

  if (error) throw createError({ statusCode: 503, statusMessage: "Notification devices could not be checked" });
  return {
    deviceCount: data?.length || 0,
    registered: Boolean(endpoint && data?.some((device) => device.endpoint === endpoint)),
  };
});
