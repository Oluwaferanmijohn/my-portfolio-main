import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<Record<string, unknown>>(event);
  const title = String(body.title || "").trim();
  const slug = String(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  if (!title || title.length > 160 || !slug || slug.length > 180) throw createError({ statusCode: 400, statusMessage: "A valid project title is required" });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw createError({ statusCode: 400, statusMessage: "Project slug can contain lowercase letters, numbers, and hyphens" });
  if (body.project_url && !/^https:\/\//i.test(String(body.project_url))) throw createError({ statusCode: 400, statusMessage: "Project links must use HTTPS" });
  if (body.image_url && !String(body.image_url).startsWith("/") && !/^https:\/\//i.test(String(body.image_url))) throw createError({ statusCode: 400, statusMessage: "Image links must use HTTPS or a local site path" });
  if (body.status && !["Complete", "In progress", "Archived"].includes(String(body.status))) throw createError({ statusCode: 400, statusMessage: "Invalid project status" });
  const project = {
    slug, title, category: String(body.category || "Software").slice(0, 100),
    summary: String(body.summary || "").slice(0, 3000), concept: String(body.concept || "").slice(0, 3000),
    ai_experience: String(body.ai_experience || "").slice(0, 3000), status: body.status || "Complete",
    image_url: String(body.image_url || "").slice(0, 1000), project_url: String(body.project_url || "").slice(0, 1000),
    technologies: Array.isArray(body.technologies) ? body.technologies.map(String).slice(0, 40) : [],
    featured: Boolean(body.featured), sort_order: Number(body.sort_order) || 0, updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("portfolio_projects").insert(project).select().single();
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return data;
});
