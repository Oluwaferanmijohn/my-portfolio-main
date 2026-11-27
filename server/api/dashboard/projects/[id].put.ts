import { requirePortfolioAdmin } from "../../../utils/admin";
import { removeUnreferencedPortfolioFiles } from "../../../utils/media-cleanup";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const id = getRouterParam(event, "id")!;
  const { data: current, error: readError } = await supabase.from("portfolio_projects").select("image_url").eq("id", id).single();
  if (readError || !current) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  const body = await readBody<Record<string, unknown>>(event);
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, limit] of Object.entries({ slug: 180, title: 160, category: 100, summary: 3000, concept: 3000, ai_experience: 3000, status: 20, image_url: 1000, project_url: 1000 })) {
    if (body[key] === undefined) continue;
    if (typeof body[key] !== "string") throw createError({ statusCode: 400, statusMessage: `${key} must be text` });
    const value = body[key].trim();
    if (value.length > limit || (["slug", "title"].includes(key) && !value)) throw createError({ statusCode: 400, statusMessage: `Invalid project ${key}` });
    updates[key] = value;
  }
  if (updates.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(updates.slug))) throw createError({ statusCode: 400, statusMessage: "Project slug can contain lowercase letters, numbers, and hyphens" });
  if (updates.project_url && !/^https:\/\//i.test(String(updates.project_url))) throw createError({ statusCode: 400, statusMessage: "Project links must use HTTPS" });
  if (updates.image_url && !String(updates.image_url).startsWith("/") && !/^https:\/\//i.test(String(updates.image_url))) throw createError({ statusCode: 400, statusMessage: "Image links must use HTTPS or a local site path" });
  if (updates.status && !["Complete", "In progress", "Archived"].includes(String(updates.status))) throw createError({ statusCode: 400, statusMessage: "Invalid project status" });
  if (body.featured !== undefined) {
    if (typeof body.featured !== "boolean") throw createError({ statusCode: 400, statusMessage: "Invalid featured value" });
    updates.featured = body.featured;
  }
  if (body.sort_order !== undefined) {
    if (!Number.isSafeInteger(body.sort_order)) throw createError({ statusCode: 400, statusMessage: "Invalid project order" });
    updates.sort_order = body.sort_order;
  }
  if (body.technologies !== undefined) {
    if (!Array.isArray(body.technologies) || body.technologies.length > 40 || body.technologies.some((value) => typeof value !== "string" || value.length > 100)) throw createError({ statusCode: 400, statusMessage: "Invalid technologies" });
    updates.technologies = body.technologies;
  }
  const { data, error } = await supabase.from("portfolio_projects").update(updates).eq("id", id).select().single();
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  if (current.image_url !== data.image_url) await removeUnreferencedPortfolioFiles(supabase, [current.image_url]);
  return data;
});
