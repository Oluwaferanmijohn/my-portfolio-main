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
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
