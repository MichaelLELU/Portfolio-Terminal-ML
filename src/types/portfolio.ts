/** Source de vérité éditoriale : src/data/portfolio.json. */
export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
  links?: Record<string, string>;
}

export interface Experience {
  role: string;
  detail: string;
}

export interface PortfolioData {
  name: string;
  tagline: string;
  headline: string;
  location: string;
  about: string[];
  skills: Record<string, string[]>;
  experience: Experience[];
  projects: Project[];
  links: Record<string, string>;
}
