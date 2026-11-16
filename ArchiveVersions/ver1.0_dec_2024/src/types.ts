export interface Project {
  name: string;
  url?: string;
  /** Retired site kept as a static snapshot under /archive. */
  archived?: boolean;
}

export interface Highlight {
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  stats?: Stat[];
  highlights: Highlight[];
  /** Live websites delivered in this role. */
  sites?: Project[];
}

export interface FeaturedBuild {
  title: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  title: string;
  icon: 'ai' | 'code' | 'layers' | 'wordpress' | 'cart' | 'chart' | 'search' | 'check' | 'database' | 'cloud' | 'tool' | 'pen';
  skills: string[];
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
}

export interface PersonalityTrait {
  icon: string;
  title: string;
  description: string;
}
