export interface Project {
  id: number;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  live_url: string | null;
  thumb: string | null;
  accent: string;
  description: string;
  features: string;
}

export interface Service {
  id: number;
  num: string;
  title: string;
  items: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}
