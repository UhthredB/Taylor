export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': process.env.LLM_SITE_URL || '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { systemPrompt, userMessage, honeypot } = body;

  // Honeypot bot rejection — silent 200 with empty stream
  if (honeypot && honeypot.length > 0) {
    return new Response('data: [DONE]\n\n', {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  // Input validation
  if (!systemPrompt || !userMessage) {
    return new Response(JSON.stringify({ error: 'Missing required fields: systemPrompt and userMessage' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Size cap: 40k chars total
  if (systemPrompt.length + userMessage.length > 40000) {
    return new Response(JSON.stringify({ error: 'Input too large. Maximum 40,000 characters.' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Basic IP rate limiting via module-scope Map (resets on cold start)
  // Max 16 calls per IP per process lifetime (~4 full research runs)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!globalThis._rateMap) globalThis._rateMap = new Map();
  const calls = globalThis._rateMap.get(ip) || 0;
  if (calls >= 16) {
    return new Response(
      JSON.stringify({
        error: 'Daily research quota reached. Contact us for extended access.',
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  globalThis._rateMap.set(ip, calls + 1);

  // Validate env vars
  if (!process.env.LLM_API_KEY || !process.env.LLM_BASE_URL || !process.env.LLM_MODEL) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error. Contact the administrator.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Forward to LLM via OpenAI-compatible API
  let llmRes;
  try {
    llmRes = await fetch(process.env.LLM_BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.LLM_SITE_URL || '',
        'X-Title': 'VC Intelligence Tool',
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        max_tokens: 4096,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to connect to LLM service. Please try again.' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (!llmRes.ok) {
    const status = llmRes.status;
    let errorMsg = 'LLM service error';
    if (status === 429) errorMsg = 'LLM rate limit reached. Please wait a moment and try again.';
    else if (status === 401) errorMsg = 'LLM authentication failed. Contact the administrator.';
    else if (status >= 500) errorMsg = 'LLM service temporarily unavailable. Please try again.';

    return new Response(JSON.stringify({ error: errorMsg, status }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Pass SSE stream directly back to browser
  return new Response(llmRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': process.env.LLM_SITE_URL || '*',
    },
  });
}
