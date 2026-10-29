import { requirePortfolioAdmin } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id");
  const body = await readBody<{ read?: boolean }>(event);
  const { data, error } = await supabase.from("contact_messages").update({ read_at: body?.read ? new Date().toISOString() : null }).eq("id", id).select("id,read_at").single();
  if (error) throw createError({ statusCode: 400, statusMessage: "Could not update message status" });
  return data;
});
