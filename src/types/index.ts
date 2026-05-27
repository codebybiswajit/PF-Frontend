export interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string;
  gpa?: string;
}

export interface Experience {
  title: string;
  company: string;
  start: string;
  end: string;
  desc: string;
}

export interface Project {
  name: string;
  tech: string;
  desc: string;
  url?: string;
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
  skills?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
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
}
