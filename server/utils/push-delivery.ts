export async function deliverPushNotifications<T>(
  subscriptions: T[],
  send: (subscription: T) => Promise<void>,
  removeExpired: (subscription: T) => Promise<void>,
): Promise<boolean> {
  const results = await Promise.allSettled(subscriptions.map(async (subscription) => {
    try {
      await send(subscription);
      return true;
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await removeExpired(subscription);
      }
      return false;
    }
  }));

  return results.some((result) => result.status === "fulfilled" && result.value === true);
}
