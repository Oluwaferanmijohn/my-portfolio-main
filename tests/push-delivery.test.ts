import assert from "node:assert/strict";
import test from "node:test";
import { deliverPushNotifications } from "../server/utils/push-delivery.ts";

test("reports failure when all push services reject delivery", async () => {
  const delivered = await deliverPushNotifications([1, 2], async () => { throw new Error("unavailable"); }, async () => {});
  assert.equal(delivered, false);
});

test("reports success only after a push service accepts delivery", async () => {
  const delivered = await deliverPushNotifications([1, 2], async (id) => {
    if (id === 1) throw new Error("unavailable");
  }, async () => {});
  assert.equal(delivered, true);
});

test("removes expired subscriptions without claiming delivery", async () => {
  const removed: number[] = [];
  const delivered = await deliverPushNotifications([1], async () => { throw { statusCode: 410 }; }, async (id) => { removed.push(id); });
  assert.equal(delivered, false);
  assert.deepEqual(removed, [1]);
});
