export function usePortfolioAnalytics() {
  const sessionId = () => {
    if (!import.meta.client) return "";
    const key = "portfolio-session-id";
    try {
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch {
      return crypto.randomUUID();
    }
  };
  const track = (type: "page_view" | "cv_click" | "contact_sent", path = useRoute().path) => {
    if (!import.meta.client) return;
    void $fetch("/api/analytics", { method: "POST", body: { type, path, sessionId: sessionId() } }).catch(() => undefined);
  };
  return { track };
}
