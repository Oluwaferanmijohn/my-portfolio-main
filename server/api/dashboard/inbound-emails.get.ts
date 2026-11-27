import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const requestedPage = Number(getQuery(event).page ?? 1);
  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1 || requestedPage > 100000) throw createError({ statusCode: 400, statusMessage: "Invalid page" });
  const pageSize = 20;
  const from = (requestedPage - 1) * pageSize;
  const { data, count, error } = await supabase.from("portfolio_inbound_emails")
    .select("id,sender,sender_email,recipients,subject,body,attachment_count,received_at,read_at", { count: "exact" })
    .order("received_at", { ascending: false }).range(from, from + pageSize - 1);
  if (error) throw createError({ statusCode: 503, statusMessage: "Incoming email could not be loaded" });
  return { emails: data || [], total: count || 0, page: requestedPage, pageSize };
});
