export interface Education {
  degree: string;
  field?: string;
  institution: string;
  location?: string;
  start: string;
  end: string;
  gpa?: string;
  honors?: string;
  courses?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  type?: string;
  start: string;
  end: string;
  desc?: string;
  summary?: string;
  bullets?: string[];
  tech?: string[];
}

export interface Project {
  name: string;
  tagline?: string;
  tech: string | string[];
  desc: string;
  url?: string;
  repo?: string;
  highlights?: string[];
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  location?: string;
  website?: string;
  skills?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  portfolioSlug?: string;

  // Rich resume fields
  tagline?: string;
  profilePhoto?: string;
  contact?: ResumeContact;
  skillGroups?: ResumeSkillGroup[];
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
  interests?: string[];
  openToWork?: boolean;
  availableFrom?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  badge: string;
  badgeColor?: string;
  bgClass: string;
  tags: string[];
  features: { title: string; body: string }[];
  tech: string[];
  stack: string;
  url?: string;
}

export interface ResumeContact {
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface ResumeSkillGroup {
  category: string;
  icon?: string;
  skills: string[];
}

export interface ResumeEducation {
  degree: string;
  field?: string;
  institution: string;
  location?: string;
  start: string;
  end: string;
  gpa?: string;
  honors?: string;
  courses?: string[];
}

export interface ResumeExperience {
  title: string;
  company: string;
  location?: string;
  type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  start: string;
  end: string; // 'Present' or date string
  summary?: string;
  bullets: string[];
  tech?: string[];
}

export interface ResumeProject {
  name: string;
  tagline?: string;
  tech: string[];
  desc: string;
  url?: string;
  repo?: string;
  highlights?: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  url?: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  title: string;
  contact: ResumeContact;
  summary: string;
  skillGroups: ResumeSkillGroup[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];

  profilePhoto?: string;
  tagline?: string;
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
  interests?: string[];
  openToWork?: boolean;
  availableFrom?: string;
}
