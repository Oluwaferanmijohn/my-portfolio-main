import { requirePortfolioAdmin } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const body = await readBody<{ read?: boolean }>(event);
  if (typeof body?.read !== "boolean") throw createError({ statusCode: 400, statusMessage: "Invalid read status" });
  const { data, error } = await supabase.from("portfolio_inbound_emails")
    .update({ read_at: body.read ? new Date().toISOString() : null }).eq("id", id).select("id,read_at").single();
  if (error || !data) throw createError({ statusCode: 404, statusMessage: "Email not found" });
  return data;
});
