import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    const { data, error } = await supabase.from("portfolio_site_settings").select("value").eq("key", "cv_url").maybeSingle();
    if (error) return { cvUrl: "" };
    return { cvUrl: data?.value || "" };
  } catch {
    return { cvUrl: "" };
  }
});

