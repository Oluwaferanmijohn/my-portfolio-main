import { serverSupabaseClient } from "#supabase/server/serverSupabaseClient";

const origin = "https://oluwaferanmijohn.name.ng";
const staticPaths = ["/", "/work", "/about", "/services", "/blog", "/contact"];

export default defineEventHandler(async (event) => {
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600");
  const pages = staticPaths.map((path) => ({ url: new URL(path, origin).href, lastmod: "" }));
  try {
    const supabase = await serverSupabaseClient(event);
    const { data, error } = await supabase.from("portfolio_articles").select("slug,updated_at").eq("status", "Published");
    if (error) throw error;
    for (const article of data || []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) continue;
      pages.push({ url: new URL(`/blog/${article.slug}`, origin).href, lastmod: article.updated_at?.slice(0, 10) || "" });
    }
  } catch (error) { console.error("Could not include article URLs in sitemap", error); }
  const entries = pages.map(({ url, lastmod }) => `<url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
});
