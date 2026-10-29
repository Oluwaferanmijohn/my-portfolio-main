import { serverSupabaseUser } from "#supabase/server/serverSupabaseUser";
import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.sub;
  if (!userId) throw createError({ statusCode: 401, statusMessage: "Sign in to enable dashboard notifications" });
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<{ endpoint?: string; keys?: { auth?: string; p256dh?: string } }>(event);
  if (!body?.endpoint || !/^https:\/\//i.test(body.endpoint) || !body.keys?.auth || !body.keys?.p256dh) {
    throw createError({ statusCode: 400, statusMessage: "Invalid browser push subscription" });
  }
  const { error } = await supabase.from("portfolio_push_subscriptions").upsert({ user_id: userId, endpoint: body.endpoint, subscription: body, updated_at: new Date().toISOString() }, { onConflict: "endpoint" });
  if (error) throw createError({ statusCode: 400, statusMessage: "Could not save this device's notification subscription" });
  return { ok: true };
});
