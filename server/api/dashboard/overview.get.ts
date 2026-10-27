import { requirePortfolioAdmin } from "../../utils/admin";

export default defineEventHandler(async (event) => {
  const supabase = await requirePortfolioAdmin(event);
  const midnight = new Date(); midnight.setUTCHours(0, 0, 0, 0);
  const [projects, visits, cvClicks, visitsToday, messages] = await Promise.all([
    supabase.from("portfolio_projects").select("id", { count: "exact", head: true }),
    supabase.from("portfolio_events").select("id", { count: "exact", head: true }).eq("event_type", "page_view"),
    supabase.from("portfolio_events").select("id", { count: "exact", head: true }).eq("event_type", "cv_click"),
    supabase.from("portfolio_events").select("id", { count: "exact", head: true }).eq("event_type", "page_view").gte("created_at", midnight.toISOString()),
    supabase.from("contact_messages").select("id,name,email,subject,message,created_at,read_at", { count: "exact" }).order("created_at", { ascending: false }).limit(100),
  ]);
  if (projects.error || visits.error || cvClicks.error || visitsToday.error || messages.error) throw createError({ statusCode: 503, statusMessage: "Dashboard data is unavailable. Apply the Supabase migration." });
  return {
    projectCount: projects.count || 0,
    visits: visits.count || 0,
    cvClicks: cvClicks.count || 0,
    contacts: messages.count || 0,
    visitsToday: visitsToday.count || 0,
    messages: messages.data || [],
  };
});
