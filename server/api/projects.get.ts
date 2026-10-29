import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.from("portfolio_projects").select("*").order("sort_order");
  if (error) throw createError({ statusCode: 503, statusMessage: "Projects are not available yet. Apply the Supabase migration." });
  return data;
});
