const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function getCorsHeaders(origin, allowedOrigin) {
  const validOrigin = allowedOrigin || '*';
  const allowOrigin = (origin && allowedOrigin && (origin === allowedOrigin || allowedOrigin === '*')) 
    ? origin 
    : validOrigin;
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      'Cache-Control': 'public, max-age=300',
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

async function handleProjects(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM projects ORDER BY num ASC'
  ).all();
  
  const projects = results.map((p) => ({
    ...p,
    liveUrl: p.live_url,
    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
  }));
  
  return jsonResponse(projects, 200, env);
}

async function handleServices(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM services ORDER BY num ASC'
  ).all();
  
  const services = results.map((s) => ({
    ...s,
    items: JSON.parse(s.items),
  }));
  
  return jsonResponse(services, 200, env);
}

async function handleTestimonials(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM testimonials ORDER BY id ASC'
  ).all();
  
  return jsonResponse(results, 200, env);
}

async function handleContact(env, body) {
  const { name, email, project, budget, message } = body;
  
  if (!name || !email || !message) {
    return errorResponse('Missing required fields: name, email, message', 400, env);
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    return errorResponse('Invalid email address', 400, env);
  }
  
  if (message.length > 5000) {
    return errorResponse('Message too long (max 5000 characters)', 400, env);
  }
  
  await env.DB.prepare(
    `INSERT INTO contact_submissions (name, email, project, budget, message)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(name, email.trim(), project || null, budget || null, message.trim()).run();
  
  console.log(`New contact from ${email}: ${name}`);
  
  return jsonResponse({ success: true, message: 'Message received successfully' }, 201, env);
}

async function handleUpload(env, request) {
  if (!env.R2_BUCKET) {
    return errorResponse('R2 not configured', 500, env);
  }
  
  const contentType = request.headers.get('Content-Type') || '';
  
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/octet-stream')) {
    return errorResponse('Invalid content type', 400, env);
  }
  
  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file) {
    return errorResponse('No file provided', 400, env);
  }
  
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return errorResponse('File too large (max 10MB)', 400, env);
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return errorResponse('File type not allowed', 400, env);
  }
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'bin';
  const fileName = `${timestamp}-${randomStr}.${ext}`;
  
  await env.R2_BUCKET.put(fileName, file, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });
  
  return jsonResponse({ 
    success: true, 
    fileName,
    url: `/api/files/${fileName}`,
    size: file.size,
  }, 201, env);
}

async function handleListFiles(env) {
  if (!env.R2_BUCKET) {
    return errorResponse('R2 not configured', 500, env);
  }
  
  const listed = await env.R2_BUCKET.list({ limit: 100 });
  
  const files = listed.objects.map((obj) => ({
    name: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
    httpMetadata: obj.httpMetadata,
  }));
  
  return jsonResponse({ files, count: files.length }, 200, env);
}

async function handleGetFile(env, fileName) {
  if (!env.R2_BUCKET) {
    return errorResponse('R2 not configured', 500, env);
  }
  
  const object = await env.R2_BUCKET.get(fileName);
  
  if (!object) {
    return errorResponse('File not found', 404, env);
  }
  
  const corsHeaders = getCorsHeaders(null, env.ALLOWED_ORIGIN);
  
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata.contentType || 'application/octet-stream',
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ...securityHeaders,
      ...corsHeaders,
    },
  });
}

async function handleDeleteFile(env, fileName) {
  if (!env.R2_BUCKET) {
    return errorResponse('R2 not configured', 500, env);
  }
  
  await env.R2_BUCKET.delete(fileName);
  return jsonResponse({ success: true, message: 'File deleted' }, 200, env);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const path = url.pathname.replace('/api', '');

    if (request.method === 'OPTIONS') {
      const corsHeaders = getCorsHeaders(origin, env.ALLOWED_ORIGIN);
      return new Response(null, { headers: { ...securityHeaders, ...corsHeaders } });
    }

    try {
      if (path === '/projects' && request.method === 'GET') {
        return handleProjects(env);
      }

      if (path === '/services' && request.method === 'GET') {
        return handleServices(env);
      }

      if (path === '/testimonials' && request.method === 'GET') {
        return handleTestimonials(env);
      }

      if (path === '/contact' && request.method === 'POST') {
        const body = await request.clone().json();
        return handleContact(env, body);
      }

      if (path === '/upload' && request.method === 'POST') {
        return handleUpload(env, request);
      }

      if (path === '/files' && request.method === 'GET') {
        return handleListFiles(env);
      }

      if (path.startsWith('/files/') && request.method === 'GET') {
        const fileName = path.replace('/files/', '');
        return handleGetFile(env, fileName);
      }

      if (path.startsWith('/files/') && request.method === 'DELETE') {
        const fileName = path.replace('/files/', '');
        return handleDeleteFile(env, fileName);
      }

      if (path === '/health' && request.method === 'GET') {
        return jsonResponse({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }, 200, env);
      }

      return errorResponse('Not found', 404, env);
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal server error', 500, env);
    }
  },
};
