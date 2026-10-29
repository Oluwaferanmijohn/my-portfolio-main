export default defineNuxtPlugin(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Portfolio service worker could not be registered", error);
      });
    }, { once: true });
  }
});
