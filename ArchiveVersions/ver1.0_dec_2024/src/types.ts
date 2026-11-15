export interface SkillCard {
  title: string;
  description: string;
  color: string;
}

export interface Project {
  name: string;
  url?: string;
  /** Retired site kept as a static snapshot under /archive. */
  archived?: boolean;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  skills: SkillCard[];
  projects?: Project[];
}

export interface SkillCategory {
  title: string;
  icon: 'FaRobot' | 'FaCode' | 'FaDatabase' | 'FaCloud' | 'FaPalette';
  skills: { name: string; description: string }[];
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  subtitle?: string;
}

export interface PersonalityTrait {
  icon: string;
  title: string;
  description: string;
}
