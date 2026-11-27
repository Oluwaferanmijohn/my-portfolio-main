import { requirePortfolioAdmin } from "../../../../utils/admin";
import { sendContactEmail } from "../../../../utils/contact-email";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const { data: message, error } = await supabase.from("contact_messages")
    .select("id,name,email,subject,message,email_status,email_attempts,created_at")
    .eq("id", id).single();
  if (error || !message) throw createError({ statusCode: 404, statusMessage: "Message not found" });
  if (message.email_status === "sent") throw createError({ statusCode: 409, statusMessage: "Email was already sent" });
  if (message.email_status === "pending" && Date.now() - new Date(message.created_at).getTime() < 5 * 60_000) throw createError({ statusCode: 409, statusMessage: "Email delivery is still in progress" });
  const result = await sendContactEmail(event, message);
  if (result.status !== "sent") throw createError({ statusCode: 503, statusMessage: result.error || "Email could not be sent" });
  return { ok: true };
});
