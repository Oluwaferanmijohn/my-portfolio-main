import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const requestedPage = Number(getQuery(event).page ?? 1);
  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1 || requestedPage > 100000) throw createError({ statusCode: 400, statusMessage: "Invalid page" });
  const pageSize = 20;
  const from = (requestedPage - 1) * pageSize;
  const { data, count, error } = await supabase.from("contact_messages")
    .select("id,name,email,subject,message,created_at,read_at,email_status,email_attempts,email_error,email_sent_at", { count: "exact" })
    .order("created_at", { ascending: false }).range(from, from + pageSize - 1);
  if (error) throw createError({ statusCode: 503, statusMessage: "Messages could not be loaded." });
  return { messages: data || [], total: count || 0, page: requestedPage, pageSize };
});
