export default defineNuxtPlugin((nuxtApp) => {
  const { track } = usePortfolioAnalytics();
  nuxtApp.hook("page:finish", () => track("page_view", useRoute().path));
});
