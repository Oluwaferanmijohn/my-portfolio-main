import assert from "node:assert/strict";
import test from "node:test";
import { parsePortfolioStorageUrl } from "../server/utils/media-cleanup.ts";

const base = "https://example.supabase.co";

test("recognizes only this project's public storage files", () => {
  assert.deepEqual(parsePortfolioStorageUrl(`${base}/storage/v1/object/public/portfolio-media/seed/cover.png`, base), { bucket: "portfolio-media", path: "seed/cover.png" });
  assert.deepEqual(parsePortfolioStorageUrl(`${base}/storage/v1/object/public/portfolio-documents/cv.pdf`, base), { bucket: "portfolio-documents", path: "cv.pdf" });
  assert.equal(parsePortfolioStorageUrl("https://other.supabase.co/storage/v1/object/public/portfolio-media/cover.png", base), null);
  assert.equal(parsePortfolioStorageUrl(`${base}/storage/v1/object/public/other-bucket/cover.png`, base), null);
  assert.equal(parsePortfolioStorageUrl(`${base}/storage/v1/object/public/portfolio-media/%2e%2e/cover.png`, base), null);
});
