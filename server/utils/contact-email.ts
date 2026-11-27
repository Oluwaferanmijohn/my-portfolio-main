import { createClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

export interface ContactEmailMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  email_attempts?: number;
}

export async function sendContactEmail(event: H3Event, message: ContactEmailMessage) {
  const config = useRuntimeConfig(event);
  const attempts = (message.email_attempts || 0) + 1;
  let status: "sent" | "failed" | "unconfigured" = "unconfigured";
  let deliveryError: string | null = null;
  if (config.resendApiKey && config.contactEmail) {
    try {
      await $fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${config.resendApiKey}`, "Idempotency-Key": `portfolio-contact/${message.id}` },
        body: {
          from: config.fromEmail,
          to: [config.contactEmail],
          reply_to: message.email,
          subject: `Portfolio: ${message.subject}`,
          text: `From: ${message.name} <${message.email}>\n\n${message.message}`,
        },
      });
      status = "sent";
    } catch (error: any) {
      status = "failed";
      deliveryError = String(error?.data?.message || error?.message || "Email provider request failed").slice(0, 500);
      console.error("Portfolio contact email delivery failed", deliveryError);
    }
  } else {
    deliveryError = "Resend email settings are incomplete";
  }
  if (config.supabaseServiceRoleKey && process.env.SUPABASE_URL) {
    const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { error } = await supabase.from("contact_messages").update({
      email_status: status,
      email_attempts: attempts,
      email_error: deliveryError,
      email_sent_at: status === "sent" ? new Date().toISOString() : null,
    }).eq("id", message.id);
    if (error) console.error("Portfolio email delivery status could not be saved", error.message);
  } else {
    console.error("Portfolio email delivery status could not be saved: Supabase service configuration missing");
  }
  return { status, error: deliveryError, attempts };
}
