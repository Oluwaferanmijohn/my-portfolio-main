export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  concept: string;
  ai_experience: string;
  status: "Complete" | "In progress" | "Archived";
  image_url: string;
  project_url: string;
  technologies: string[];
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
