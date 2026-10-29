function decodeApplicationServerKey(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "="));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function usePortfolioPush() {
  const supported = ref(false);
  const enabled = ref(false);
  const permission = ref<NotificationPermission | "unsupported">("unsupported");

  async function refresh() {
    if (!import.meta.client) return;
    supported.value = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported.value) return;
    permission.value = Notification.permission;
    if (permission.value === "granted") {
      const registration = await navigator.serviceWorker.ready;
      enabled.value = Boolean(await registration.pushManager.getSubscription());
    }
  }

  async function enable() {
    if (!supported.value) throw new Error("Push notifications are not supported in this browser.");
    const result = await Notification.requestPermission();
    permission.value = result;
    if (result !== "granted") throw new Error("Allow notifications in your browser settings to continue.");
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const { publicKey } = await $fetch<{ publicKey: string }>("/api/push/public-key");
      if (!publicKey) throw new Error("Push notifications need VAPID keys in the server environment.");
      subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeApplicationServerKey(publicKey) });
    }
    await $fetch("/api/push/subscribe", { method: "POST", body: subscription.toJSON() });
    enabled.value = true;
  }

  async function disable() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await $fetch("/api/push/unsubscribe", { method: "POST", body: { endpoint: subscription.endpoint } });
      await subscription.unsubscribe();
    }
    enabled.value = false;
  }

  return { supported, enabled, permission, refresh, enable, disable };
}
