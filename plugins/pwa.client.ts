export default defineNuxtPlugin(() => {
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
