import { requirePortfolioAdmin } from "../../../utils/admin";
import { removeUnreferencedPortfolioFiles } from "../../../utils/media-cleanup";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<{ cvUrl?: string }>(event);
  const cvUrl = String(body?.cvUrl || "").trim().slice(0, 1000);
  if (cvUrl && !/^https:\/\//i.test(cvUrl)) throw createError({ statusCode: 400, statusMessage: "CV link must use HTTPS" });
  const { data: previous, error: readError } = await supabase.from("portfolio_site_settings").select("value").eq("key", "cv_url").maybeSingle();
  if (readError) throw createError({ statusCode: 503, statusMessage: "CV settings are unavailable" });
  const { error } = await supabase.from("portfolio_site_settings").upsert({ key: "cv_url", value: cvUrl, updated_at: new Date().toISOString() });
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  if (previous?.value && previous.value !== cvUrl) await removeUnreferencedPortfolioFiles(supabase, [previous.value]);
  return { cvUrl };
});
