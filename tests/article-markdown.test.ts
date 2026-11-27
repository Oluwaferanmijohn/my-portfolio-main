import assert from "node:assert/strict";
import test from "node:test";
import { extractArticleImageUrls, renderArticleMarkdown } from "../utils/articleMarkdown.ts";

test("article Markdown renders formatting and embedded images", () => {
  const content = "## A heading\n\n**Important** text.\n\n![Project image](https://example.com/image.png)";
  const html = renderArticleMarkdown(content);
  assert.match(html, /<h2>A heading<\/h2>/);
  assert.match(html, /<strong>Important<\/strong>/);
  assert.match(html, /<img src="https:\/\/example.com\/image.png"/);
  assert.deepEqual(extractArticleImageUrls(content), ["https://example.com/image.png"]);
});

test("article Markdown escapes raw HTML and unsafe links", () => {
  const html = renderArticleMarkdown('<script>alert(1)</script> [bad](javascript:alert(1)) ![bad](data:image/svg+xml;base64,PHN2Zz4=)');
  assert.doesNotMatch(html, /<script>|href="javascript:|src="data:/);
  assert.match(html, /&lt;script&gt;/);
});
