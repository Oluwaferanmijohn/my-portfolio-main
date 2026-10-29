import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import type { H3Event } from "h3";

export async function notifyPortfolioAdmin(event: H3Event, subject: string, senderName: string): Promise<boolean> {
  const config = useRuntimeConfig(event);
  if (!config.supabaseServiceRoleKey || !config.adminUserId || !config.public.vapidPublicKey || !config.vapidPrivateKey || !process.env.SUPABASE_URL) return false;
  const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: subscriptions, error } = await supabase.from("portfolio_push_subscriptions").select("id,subscription").eq("user_id", config.adminUserId);
  if (error || !subscriptions?.length) return false;
  webpush.setVapidDetails(config.vapidSubject, config.public.vapidPublicKey, config.vapidPrivateKey);
  const payload = JSON.stringify({
    title: "New portfolio message",
    body: `${senderName} sent you a message: ${subject}`.slice(0, 180),
    url: "/dashboard",
    tag: "portfolio-message",
  });
  const results = await Promise.allSettled(subscriptions.map(async ({ id, subscription }) => {
    try {
      await webpush.sendNotification(subscription, payload, { TTL: 60 * 60 });
    } catch (pushError: any) {
      if (pushError?.statusCode === 404 || pushError?.statusCode === 410) {
        await supabase.from("portfolio_push_subscriptions").delete().eq("id", id);
      }
    }
  }));
  return results.some((result) => result.status === "fulfilled");
}
