export interface PortfolioArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  image_urls: string[];
  status: "Draft" | "Published";
  read_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PortfolioArticleSummary = Pick<PortfolioArticle, "id" | "slug" | "title" | "excerpt" | "category" | "image_url" | "read_count" | "published_at">;
