interface Env {
  DB: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const bodyText = await request.text();
    const data = JSON.parse(bodyText);
    
    const { name, email, phone, project, budget, message, location } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const result = await env.DB.prepare(`
      INSERT INTO contacts (name, email, phone, project_type, budget, message, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(name, email, phone || null, project || null, budget || null, message, location || null).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Contact form submitted successfully",
      id: result.meta?.last_row_id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
