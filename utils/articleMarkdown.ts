import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });
const validateLink = markdown.validateLink.bind(markdown);
markdown.validateLink = (url) => validateLink(url) && !/^data:/i.test(url);

export function renderArticleMarkdown(content: string) {
  return markdown.render(content || "");
}

export function extractArticleImageUrls(content: string) {
  const urls: string[] = [];
  const tokens = markdown.parse(content || "", {});
  for (const token of tokens) {
    for (const child of token.children || []) {
      if (child.type !== "image") continue;
      const source = child.attrGet("src");
      if (source) urls.push(String(source));
    }
  }
  return urls;
}
