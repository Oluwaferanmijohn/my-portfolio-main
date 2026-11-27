import { createClient } from "@supabase/supabase-js";
import { createHmac } from "node:crypto";
import { notifyPortfolioAdmin } from "../utils/push";
import { sendContactEmail } from "../utils/contact-email";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; subject?: string; message?: string; website?: string }>(event);
  if (body?.website) return { ok: true };
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const subject = String(body?.subject || "Portfolio enquiry").trim();
  const message = String(body?.message || "").trim();
  if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || subject.length > 200 || message.length < 5 || message.length > 10000) {
    throw createError({ statusCode: 400, statusMessage: "Please check the contact form fields" });
  }
  const config = useRuntimeConfig(event);
  if (!config.supabaseServiceRoleKey || !process.env.SUPABASE_URL) throw createError({ statusCode: 503, statusMessage: "Contact form is temporarily unavailable" });
  const clientIp = (process.env.VERCEL ? getRequestHeader(event, "x-vercel-forwarded-for") : getRequestIP(event)) || "unavailable";
  const ipHash = createHmac("sha256", config.supabaseServiceRoleKey).update(clientIp.split(",")[0]!.trim()).digest("hex");
  const supabase = createClient(process.env.SUPABASE_URL, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: messageId, error } = await supabase.rpc("submit_portfolio_message", { p_name: name, p_email: email, p_subject: subject, p_message: message, p_ip_hash: ipHash });
  if (error?.code === "P0001") throw createError({ statusCode: 429, statusMessage: "You have sent several messages recently. Please try again later or email me directly." });
  if (error) throw createError({ statusCode: 503, statusMessage: "Your message could not be saved. Please email directly instead." });
  if (messageId) await sendContactEmail(event, { id: messageId, name, email, subject, message });
  try {
    await notifyPortfolioAdmin(event, subject || "Portfolio enquiry", name);
  } catch (pushError) {
    console.error("Portfolio push notification failed after message was saved", pushError);
  }
  return { ok: true };
});

