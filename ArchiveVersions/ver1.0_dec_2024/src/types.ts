export interface SkillCard {
  title: string;
  description: string;
  color: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  skills: SkillCard[];
  projects?: Array<{
    name: string;
    url: string;
  }>;
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

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}