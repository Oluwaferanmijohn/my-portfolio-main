import { requirePortfolioAdmin } from "../../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const body = await readBody<Record<string, unknown>>(event);
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ["slug", "title", "category", "summary", "concept", "ai_experience", "status", "image_url", "project_url", "featured", "sort_order"]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (updates.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(updates.slug))) throw createError({ statusCode: 400, statusMessage: "Project slug can contain lowercase letters, numbers, and hyphens" });
  if (updates.project_url && !/^https:\/\//i.test(String(updates.project_url))) throw createError({ statusCode: 400, statusMessage: "Project links must use HTTPS" });
  if (updates.image_url && !String(updates.image_url).startsWith("/") && !/^https:\/\//i.test(String(updates.image_url))) throw createError({ statusCode: 400, statusMessage: "Image links must use HTTPS or a local site path" });
  if (updates.status && !["Complete", "In progress", "Archived"].includes(String(updates.status))) throw createError({ statusCode: 400, statusMessage: "Invalid project status" });
  if (body.technologies !== undefined) updates.technologies = Array.isArray(body.technologies) ? body.technologies.map(String).slice(0, 40) : [];
  const { data, error } = await supabase.from("portfolio_projects").update(updates).eq("id", getRouterParam(event, "id")!).select().single();
  if (error) throw createError({ statusCode: 400, statusMessage: error.message });
  return data;
});
