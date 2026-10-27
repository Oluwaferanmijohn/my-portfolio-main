import { serverSupabaseClient } from "#supabase/server";

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
  const supabase = await serverSupabaseClient(event);
  const { error } = await supabase.rpc("submit_portfolio_message", { p_name: name, p_email: email, p_subject: subject, p_message: message });
  if (error?.code === "P0001") throw createError({ statusCode: 429, statusMessage: "You have sent several messages recently. Please try again later or email me directly." });
  if (error) throw createError({ statusCode: 503, statusMessage: "Your message could not be saved. Please email directly instead." });
  const config = useRuntimeConfig(event);
  if (config.resendApiKey && config.contactEmail) {
    try {
      await $fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${config.resendApiKey}` },
        body: {
          from: config.fromEmail,
          to: [config.contactEmail],
          reply_to: email,
          subject: `Portfolio: ${subject}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        },
      });
    } catch {
      // The message is already saved in the Supabase inbox for dashboard follow-up.
    }
  }
  return { ok: true };
});

