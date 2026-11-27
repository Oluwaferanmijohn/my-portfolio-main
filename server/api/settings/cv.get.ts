import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase.from("portfolio_site_settings").select("value").eq("key", "cv_url").maybeSingle();
  if (error) throw createError({ statusCode: 503, statusMessage: "CV settings are unavailable" });
  return { cvUrl: data?.value || "" };
});

