import { requirePortfolioAdmin } from "../../utils/admin";
import { parsePortfolioStorageUrl, removeUnreferencedPortfolioFiles } from "../../utils/media-cleanup";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<{ url?: string }>(event);
  const url = String(body?.url || "");
  if (!parsePortfolioStorageUrl(url, process.env.SUPABASE_URL || "")) {
    throw createError({ statusCode: 400, statusMessage: "Choose a portfolio storage file" });
  }
  const failed = await removeUnreferencedPortfolioFiles(supabase, [url]);
  if (failed.length) throw createError({ statusCode: 503, statusMessage: "The unused file could not be removed" });
  return { ok: true };
});
