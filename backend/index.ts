interface Env {
  DB: D1Database;
}

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  project?: string;
  budget?: string;
  message: string;
}

function corsResponse() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsResponse(),
    },
  });
}

function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      ...corsResponse(),
    },
  });
}

async function handleContact(env: Env, body: ContactSubmission): Promise<Response> {
  const { name, email, phone, project, budget, message } = body;
  
  if (!name || !email || !message) {
    return errorResponse('Missing required fields: name, email, message', 400);
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    return errorResponse('Invalid email address', 400);
  }
  
  if (name.length > 100) {
    return errorResponse('Name too long (max 100 characters)', 400);
  }
  
  if (message.length > 5000) {
    return errorResponse('Message too long (max 5000 characters)', 400);
  }
  
  try {
    const result = await env.DB.prepare(
      `INSERT INTO contact_submissions (name, email, phone, project, budget, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      name.trim(), 
      email.trim().toLowerCase(), 
      phone?.trim() || null, 
      project || null, 
      budget || null, 
      message.trim()
    ).run();
    
    console.log(`New contact submission: ${name} <${email}>`);
    
    return jsonResponse({ 
      success: true, 
      message: 'Message received successfully',
      id: result.meta?.last_row_id
    }, 201);
    
  } catch (err) {
    console.error('Database error:', err);
    return errorResponse('Failed to save message. Please try again.', 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsResponse()
      });
    }

    try {
      // POST /api/contact - Submit contact form
      if (path === '/contact' && request.method === 'POST') {
        const body = await request.clone().json() as ContactSubmission;
        return handleContact(env, body);
      }

      // GET /api/health - Health check
      if (path === '/health' && request.method === 'GET') {
        return jsonResponse({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          service: 'contact-api'
        });
      }

      return errorResponse('Not found', 404);
      
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal server error', 500);
    }
  },
};
