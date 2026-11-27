import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { notifyPortfolioAdmin } from "../../utils/push";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.resendApiKey || !config.resendWebhookSecret || !config.supabaseServiceRoleKey || !process.env.SUPABASE_URL) {
    throw createError({ statusCode: 503, statusMessage: "Inbound email is not configured" });
  }
  const rawBody = await readRawBody(event);
  if (!rawBody) throw createError({ statusCode: 400, statusMessage: "Empty webhook body" });
  const resend = new Resend(config.resendApiKey);
  let payload;
  try {
    payload = resend.webhooks.verify({
      payload: rawBody,
      headers: {
        id: getRequestHeader(event, "svix-id") || "",
        timestamp: getRequestHeader(event, "svix-timestamp") || "",
        signature: getRequestHeader(event, "svix-signature") || "",
      },
      webhookSecret: config.resendWebhookSecret,
    });
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid webhook signature" });
  }
  if (payload.type !== "email.received") return { ok: true };
  const emailId = payload.data.email_id;
  if (!emailId || !/^[a-zA-Z0-9_-]{1,120}$/.test(emailId)) throw createError({ statusCode: 400, statusMessage: "Invalid email ID" });
  const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: existing, error: lookupError } = await supabase.from("portfolio_inbound_emails").select("id").eq("resend_email_id", emailId).maybeSingle();
  if (lookupError) throw createError({ statusCode: 503, statusMessage: "Inbound email storage is unavailable" });
  if (existing) return { ok: true, duplicate: true };
  const { data: received, error: resendError } = await resend.emails.receiving.get(emailId);
  if (resendError || !received) throw createError({ statusCode: 503, statusMessage: "Could not retrieve received email" });
  const senderEmail = received.from.match(/<([^<>\s]+@[^<>\s]+)>/)?.[1] || received.from.trim();
  const { error: insertError } = await supabase.from("portfolio_inbound_emails").insert({
    resend_email_id: emailId,
    sender: received.from.slice(0, 500),
    sender_email: senderEmail.slice(0, 320),
    recipients: received.to.slice(0, 20),
    subject: received.subject.slice(0, 500),
    body: (received.text || "[This email has no plain-text body. View it in Resend.]").slice(0, 50000),
    attachment_count: received.attachments.length,
    received_at: received.created_at,
  });
  if (insertError?.code === "23505") return { ok: true, duplicate: true };
  if (insertError) throw createError({ statusCode: 503, statusMessage: "Could not save inbound email" });
  try { await notifyPortfolioAdmin(event, `New email: ${received.subject || "No subject"}`, received.from); }
  catch (pushError) { console.error("Inbound email push notification failed", pushError); }
  return { ok: true };
});
