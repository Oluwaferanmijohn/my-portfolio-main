export function usePortfolioAnalytics() {
  const track = (type: "page_view" | "cv_click", path = useRoute().path) => {
    if (!import.meta.client) return;
    void $fetch("/api/analytics", { method: "POST", body: { type, path } }).catch(() => undefined);
  };
  return { track };
}
