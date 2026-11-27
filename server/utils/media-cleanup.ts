import type { SupabaseClient } from "@supabase/supabase-js";
import { extractArticleImageUrls } from "../../utils/articleMarkdown.ts";

type PortfolioStorageFile = { bucket: "portfolio-media" | "portfolio-documents"; path: string };

export function parsePortfolioStorageUrl(value: string, supabaseUrl: string): PortfolioStorageFile | null {
  try {
    const url = new URL(value);
    if (url.origin !== new URL(supabaseUrl).origin || url.search || url.hash) return null;
    const match = url.pathname.match(/^\/storage\/v1\/object\/public\/(portfolio-media|portfolio-documents)\/(.+)$/);
    if (!match) return null;
    const encodedPath = match[2];
    if (!encodedPath) return null;
    const path = decodeURIComponent(encodedPath);
    if (!path || path.split("/").some((part) => !part || part === "." || part === ".." || part.includes("\\"))) return null;
    return { bucket: match[1] as PortfolioStorageFile["bucket"], path };
  } catch {
    return null;
  }
}

async function isStillReferenced(supabase: SupabaseClient, url: string, bucket: PortfolioStorageFile["bucket"]) {
  const queries = bucket === "portfolio-documents"
    ? [supabase.from("portfolio_site_settings").select("key").eq("key", "cv_url").eq("value", url).limit(1)]
    : [
        supabase.from("portfolio_projects").select("id").eq("image_url", url).limit(1),
        supabase.from("portfolio_articles").select("id").eq("image_url", url).limit(1),
        supabase.from("portfolio_articles").select("id").contains("image_urls", [url]).limit(1),
        supabase.from("portfolio_articles").select("id").like("content", `%${url}%`).limit(1),
      ];
  const results = await Promise.all(queries);
  for (const result of results) {
    if (result.error) throw result.error;
    if (result.data?.length) return true;
  }
  return false;
}

export { extractArticleImageUrls };

export async function removeUnreferencedPortfolioFiles(supabase: SupabaseClient, urls: string[]): Promise<string[]> {
  const failed: string[] = [];
  const supabaseUrl = process.env.SUPABASE_URL || "";
  for (const url of new Set(urls.filter(Boolean))) {
    const file = parsePortfolioStorageUrl(url, supabaseUrl);
    if (!file) continue;
    try {
      if (await isStillReferenced(supabase, url, file.bucket)) continue;
      const { error } = await supabase.storage.from(file.bucket).remove([file.path]);
      if (error) throw error;
    } catch (error) {
      console.error("Could not clean up portfolio media", { bucket: file.bucket, path: file.path, error });
      failed.push(url);
    }
  }
  return failed;
}
