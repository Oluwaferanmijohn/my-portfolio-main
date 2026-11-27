import assert from "node:assert/strict";
import test from "node:test";
import { getImageCrop } from "../utils/imageCrop.ts";

test("wide images crop to the chosen frame and allow horizontal positioning", () => {
  const left = getImageCrop(2000, 1000, 1.5, 1, 0, 0.5);
  const right = getImageCrop(2000, 1000, 1.5, 1, 1, 0.5);
  assert.deepEqual(left, { x: 0, y: 0, width: 1500, height: 1000 });
  assert.deepEqual(right, { x: 500, y: 0, width: 1500, height: 1000 });
});

test("zoomed crops remain inside the source image", () => {
  const crop = getImageCrop(1000, 2000, 1.6, 2, 1, 1);
  assert.equal(crop.width / crop.height, 1.6);
  assert.equal(crop.x + crop.width, 1000);
  assert.equal(crop.y + crop.height, 2000);
});
