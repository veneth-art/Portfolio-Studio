interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN?: string;
}

interface ContactSubmission {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function getCorsHeaders(origin, allowedOrigin) {
  const validOrigin = allowedOrigin || '*';
  const allowOrigin = (origin && allowedOrigin && (origin === allowedOrigin || allowedOrigin === '*')) 
    ? origin 
    : validOrigin;
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, env, origin) {
  const allowedOrigin = env ? env.ALLOWED_ORIGIN : undefined;
  const corsHeaders = getCorsHeaders(origin, allowedOrigin);
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...securityHeaders,
      ...corsHeaders,
    },
  });
}

function errorResponse(message, status = 400, env, origin) {
  const allowedOrigin = env ? env.ALLOWED_ORIGIN : undefined;
  const corsHeaders = getCorsHeaders(origin, allowedOrigin);
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      ...securityHeaders,
      ...corsHeaders,
    },
  });
}

async function handleContact(env: Env, body: ContactSubmission, origin): Promise<Response> {
  const { name, email, project, budget, message } = body;
  
  if (!name || !email || !message) {
    return errorResponse('Missing required fields: name, email, message', 400, env, origin);
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    return errorResponse('Invalid email address', 400, env, origin);
  }
  
  if (name.length > 100) {
    return errorResponse('Name too long (max 100 characters)', 400, env, origin);
  }
  
  if (message.length > 5000) {
    return errorResponse('Message too long (max 5000 characters)', 400, env, origin);
  }
  
  try {
    const result = await env.DB.prepare(
      `INSERT INTO contact_submissions (name, email, project, budget, message, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      name.trim(), 
      email.trim().toLowerCase(), 
      project || null, 
      budget || null, 
      message.trim()
    ).run();
    
    console.log(`New contact submission: ${name} <${email}>`);
    
    return jsonResponse({ 
      success: true, 
      message: 'Message received successfully',
      id: result.meta?.last_row_id
    }, 201, env, origin);
    
  } catch (err) {
    console.error('Database error:', err);
    return errorResponse('Failed to save message. Please try again.', 500, env, origin);
  }
}

async function handleListContacts(env: Env, origin): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100'
    ).all();
    
    return jsonResponse({ 
      success: true, 
      submissions: results,
      count: results.length
    }, 200, env, origin);
    
  } catch (err) {
    console.error('Database error:', err);
    return errorResponse('Failed to fetch submissions', 500, env, origin);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const path = url.pathname.replace('/api', '');

    if (request.method === 'OPTIONS') {
      const corsHeaders = getCorsHeaders(origin, env.ALLOWED_ORIGIN);
      return new Response(null, { headers: { ...securityHeaders, ...corsHeaders } });
    }

    try {
      // POST /api/contact - Submit contact form
      if (path === '/contact' && request.method === 'POST') {
        const body = await request.clone().json() as ContactSubmission;
        return handleContact(env, body, origin);
      }

      // GET /api/contacts - List all contacts (for admin/dashboard)
      if (path === '/contacts' && request.method === 'GET') {
        return handleListContacts(env, origin);
      }

      // GET /api/health - Health check
      if (path === '/health' && request.method === 'GET') {
        return jsonResponse({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          service: 'contact-api'
        }, 200, env, origin);
      }

      return errorResponse('Not found', 404, env, origin);
      
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal server error', 500, env, origin);
    }
  },
};
