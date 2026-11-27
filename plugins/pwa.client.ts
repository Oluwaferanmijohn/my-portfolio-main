export default defineNuxtPlugin(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    (window as Window & { portfolioInstallPrompt?: Event }).portfolioInstallPrompt = event;
    window.dispatchEvent(new Event("portfolio-install-available"));
  });
  window.addEventListener("appinstalled", () => {
    delete (window as Window & { portfolioInstallPrompt?: Event }).portfolioInstallPrompt;
    window.dispatchEvent(new Event("portfolio-install-cleared"));
  });
  if ("serviceWorker" in navigator) {
    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Portfolio service worker could not be registered", error);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }
});
