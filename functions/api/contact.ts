interface Env {
  DB: any;
}

export const onPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const data = await request.json();
    
    const { name, email, project, budget, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = await env.DB.prepare(`
      INSERT INTO contact_submissions (name, email, project, budget, message, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(name, email, project || null, budget || null, message).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
