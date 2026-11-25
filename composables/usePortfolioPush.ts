function decodeApplicationServerKey(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "="));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function usePortfolioPush() {
  const supported = ref(false);
  const enabled = ref(false);
  const deviceCount = ref(0);
  const permission = ref<NotificationPermission | "unsupported">("unsupported");

  async function refresh() {
    if (!import.meta.client) return;
    supported.value = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    permission.value = supported.value ? Notification.permission : "unsupported";
    const registration = supported.value ? await navigator.serviceWorker.getRegistration() : null;
    const subscription = registration && permission.value === "granted" ? await registration.pushManager.getSubscription() : null;
    const status = await $fetch<{ deviceCount: number; registered: boolean }>("/api/push/status", {
      method: "POST",
      body: { endpoint: subscription?.endpoint },
    });
    deviceCount.value = status.deviceCount;
    enabled.value = Boolean(subscription && status.registered);
  }

  async function enable() {
    if (!supported.value) throw new Error("Push notifications are not supported in this browser.");
    const result = await Notification.requestPermission();
    permission.value = result;
    if (result !== "granted") throw new Error("Allow notifications in your browser settings to continue.");
    const registration = await navigator.serviceWorker.register("/sw.js");
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const { publicKey } = await $fetch<{ publicKey: string }>("/api/push/public-key");
      if (!publicKey) throw new Error("Push notifications need VAPID keys in the server environment.");
      subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeApplicationServerKey(publicKey) });
    }
    await $fetch("/api/push/subscribe", { method: "POST", body: subscription.toJSON() });
    await refresh();
  }

  async function disable() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await $fetch("/api/push/unsubscribe", { method: "POST", body: { endpoint: subscription.endpoint } });
      await subscription.unsubscribe();
    }
    await refresh();
  }

  return { supported, enabled, deviceCount, permission, refresh, enable, disable };
}
