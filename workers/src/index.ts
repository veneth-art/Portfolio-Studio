interface D1Database {
  prepare(sql: string): D1Statement;
}

interface D1Statement {
  bind(...values: unknown[]): D1PreparedStatement;
}

interface D1PreparedStatement {
  run(): Promise<D1Result>;
}

interface D1Result {
  results?: unknown[];
  meta?: {
    last_row_id?: number;
    changes?: number;
  };
}

interface Env {
  DB: D1Database;
  FROM_EMAIL: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  project?: string;
  budget?: string;
  message: string;
  location?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Veneth Contact API is running' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const data: ContactFormData = await request.json();

      if (!data.name || !data.email || !data.message) {
        return new Response(
          JSON.stringify({ error: 'Name, email, and message are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const stmt = env.DB.prepare(`
        INSERT INTO contacts (name, email, phone, project_type, budget, message, location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = await stmt.bind(
        data.name,
        data.email,
        data.phone || null,
        data.project || null,
        data.budget || null,
        data.message,
        data.location || null
      ).run();

      const insertResult = result as { results?: { id: number }[]; meta?: { last_row_id: number } };

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Contact form submitted successfully',
          id: insertResult.meta?.last_row_id || insertResult.results?.[0]?.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error processing contact form:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: String(error) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
