export interface ContactForm {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'https://veneth-contact-api.studio-design.workers.dev';

export async function submitContact(data: ContactForm): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to submit form' }));
    throw new Error(error.error || 'Failed to submit form');
  }

  return response.json();
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
