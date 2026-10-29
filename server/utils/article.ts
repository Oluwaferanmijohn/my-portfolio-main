export function buildArticlePayload(body: Record<string, unknown>, existingPublishedAt?: string | null) {
  const title = String(body.title || "").trim();
  const slug = String(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  const status = String(body.status || "Draft");
  const imageUrl = String(body.image_url || "").trim();
  const imageUrls = Array.isArray(body.image_urls) ? body.image_urls.map((url) => String(url).trim()).filter(Boolean).slice(0, 12) : [];
  if (!title || title.length > 180) throw createError({ statusCode: 400, statusMessage: "A title up to 180 characters is required" });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) throw createError({ statusCode: 400, statusMessage: "Use a URL-friendly slug with lowercase letters, numbers, and hyphens" });
  if (!["Draft", "Published"].includes(status)) throw createError({ statusCode: 400, statusMessage: "Invalid article status" });
  if (imageUrl && !(imageUrl.startsWith("/") && !imageUrl.startsWith("//")) && !/^https:\/\//i.test(imageUrl)) throw createError({ statusCode: 400, statusMessage: "Article images must use HTTPS or a local site path" });
  if (imageUrls.some((url) => !(url.startsWith("/") && !url.startsWith("//")) && !/^https:\/\//i.test(url))) throw createError({ statusCode: 400, statusMessage: "Article images must use HTTPS or a local site path" });
  const content = String(body.content || "").trim();
  if (!content || content.length > 100000) throw createError({ statusCode: 400, statusMessage: "Article content is required and must be under 100,000 characters" });
  return {
    slug,
    title,
    excerpt: String(body.excerpt || "").trim().slice(0, 500),
    content,
    category: String(body.category || "Notes").trim().slice(0, 80),
    image_url: imageUrl.slice(0, 1000),
    image_urls: imageUrls.map((url) => url.slice(0, 1000)),
    status,
    published_at: status === "Published" ? existingPublishedAt || new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}
