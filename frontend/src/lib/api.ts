export interface Project {
  id: number;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  liveUrl: string | null;
  thumb: string | null;
  accent: string;
  description: string;
  features: string[];
}

export interface Service {
  id: number;
  num: string;
  title: string;
  items: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
}

export interface ContactForm {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}

export interface FileInfo {
  name: string;
  size: number;
  uploaded: string;
  httpMetadata: {
    contentType?: string;
  };
}

export interface UploadResponse {
  success: boolean;
  fileName: string;
  url: string;
  size: number;
}

const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    num: "01",
    title: "UI/UX Design",
    items: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "High-Fidelity Visual Design",
      "Design Systems & Component Libraries",
      "Usability Testing & Iteration",
      "Responsive Design",
    ],
  },
  {
    id: 2,
    num: "02",
    title: "No-Code Development",
    items: [
      "Webflow Development",
      "Framer Sites",
      "Wix Studio",
      "Bubble.io Applications",
      "Zapier Automation",
      "CMS Integration",
    ],
  },
  {
    id: 3,
    num: "03",
    title: "3D Web & Motion",
    items: [
      "Three.js Web Experiences",
      "GSAP Animations",
      "Scroll-Driven Animations",
      "Interactive 3D Elements",
      "WebGL Effects",
      "Performance Optimization",
    ],
  },
  {
    id: 4,
    num: "04",
    title: "Brand & Identity",
    items: [
      "Logo Design",
      "Brand Guidelines",
      "Social Media Templates",
      "Marketing Collateral",
      "Brand Strategy",
      "Visual Identity Systems",
    ],
  },
];

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    num: "01",
    tag: "Web Design",
    title: "Modern E-Commerce Platform",
    subtitle: "E-Commerce · UI/UX",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "A fully responsive e-commerce experience with seamless checkout flow and optimized conversion paths.",
    features: [
      "Custom product configurator",
      "One-click checkout integration",
      "Advanced filtering system",
      "Mobile-first design approach",
    ],
  },
  {
    id: 2,
    num: "02",
    tag: "No-Code",
    title: "SaaS Dashboard Design",
    subtitle: "SaaS · Dashboard",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "An intuitive analytics dashboard with real-time data visualization and customizable widgets.",
    features: [
      "Real-time data visualization",
      "Customizable widget layout",
      "Role-based access control",
      "Export & reporting tools",
    ],
  },
  {
    id: 3,
    num: "03",
    tag: "3D Web",
    title: "Immersive Portfolio",
    subtitle: "3D · Portfolio",
    liveUrl: null,
    thumb: null,
    accent: "#c9a84c",
    description: "An interactive 3D portfolio experience showcasing creative work through immersive web design.",
    features: [
      "Three.js powered scenes",
      "Scroll-driven animations",
      "Interactive 3D elements",
      "Smooth page transitions",
    ],
  },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO, TechStart",
    text: "Veneth transformed our vision into a stunning reality. The attention to detail and creative approach exceeded our expectations.",
    initials: "SM",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Founder, DesignCo",
    text: "Working with Veneth was a game-changer. The no-code solution saved us months of development time without compromising quality.",
    initials: "DC",
  },
  {
    id: 3,
    name: "Maria Santos",
    role: "Marketing Director, Brandify",
    text: "The 3D elements and animations brought our brand to life. Our engagement metrics increased by 300% after the redesign.",
    initials: "MS",
  },
];

const API_BASE = import.meta.env.VITE_API_URL || '/api';

let lastFetchError: Error | null = null;

async function fetchApi<T>(endpoint: string, fallbackData: T): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }
    lastFetchError = null;
    return response.json();
  } catch (err) {
    lastFetchError = err instanceof Error ? err : new Error(String(err));
    console.warn(`API fetch failed for ${endpoint}, using fallback data:`, lastFetchError.message);
    return fallbackData;
  }
}

async function postApi<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }
  return response.json();
}

export function hasApiError(): boolean {
  return lastFetchError !== null;
}

export function getLastError(): Error | null {
  return lastFetchError;
}

export const api = {
  getProjects: () => fetchApi<Project[]>('/projects', FALLBACK_PROJECTS),
  
  getServices: () => fetchApi<Service[]>('/services', FALLBACK_SERVICES),
  
  getTestimonials: () => fetchApi<Testimonial[]>('/testimonials', FALLBACK_TESTIMONIALS),
  
  submitContact: (data: ContactForm) => postApi<{ success: boolean; message: string }>('/contact', data),

  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `Upload error: ${response.status}`);
    }
    
    return response.json();
  },
  
  listFiles: () => fetchApi<{ files: FileInfo[]; count: number }>('/files', { files: [], count: 0 }),
  
  getFileUrl: (fileName: string): string => `${API_BASE}/files/${fileName}`,
  
  deleteFile: async (fileName: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE}/files/${fileName}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(error.error || `Delete error: ${response.status}`);
    }
    
    return response.json();
  },
};

export { FALLBACK_SERVICES, FALLBACK_PROJECTS, FALLBACK_TESTIMONIALS };
