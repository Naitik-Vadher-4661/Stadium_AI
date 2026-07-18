import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { checkRateLimit } from '@/utils/rateLimit';
import { createClient } from '@/lib/supabase/server';

// Initialize Groq provider using the OpenAI SDK format (since Groq is OpenAI-compatible)
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Zod schema for input validation
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1).max(1000), // Prevent overly long malicious inputs
    })
  ).max(20), // Limit history size
  language: z.enum(['en', 'es', 'pt', 'hi']).default('en'),
  simplifiedLanguage: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    // 0. Rate Limiting
    // In App Router, getting IP can be done via headers like 'x-forwarded-for', 
    // but Next.js standard way varies. We'll use a fallback.
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await checkRateLimit(ip);
    
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json = await req.json();
    
    // 1. Validate and sanitize user input
    const parsed = chatRequestSchema.safeParse(json);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request data', details: parsed.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages, language, simplifiedLanguage } = parsed.data;

    // 2. Grounding: Fetch relevant FAQ and Locations
    const supabase = await createClient();
    const { data: faqs } = await supabase.from('faq_content').select('*');
    
    // Import and fetch live gate data
    const { getGateData } = await import('@/lib/crowd/store');
    const gates = await getGateData();
    const gatesContext = gates.map(g => 
      `- ${g.gate_name}: Status is ${g.status}. Occupancy: ${g.occupancy_percent}%. Queue: ${g.queue_length} people.`
    ).join('\n');

    // Construct grounding context from DB rows
    let groundingContext = 'LIVE GATE STATUS (USE THIS IF ASKED ABOUT CROWDS OR GATES):\n' + gatesContext + '\n\nFAQ:\n';
    if (faqs && faqs.length > 0) {
      groundingContext += faqs.map(faq => 
        `- Q: ${faq.question_en} | A: ${faq.answer_en}`
      ).join('\n');
    } else {
      console.warn('DB Error or no FAQ data, falling back to mock data');
      groundingContext = `
- Q: Where is Gate 1? | A: Gate 1 is at the main entrance, Level 1.
- Q: Where can I get food or drinks? | A: Food Court A is located on Level 2, offering a variety of food and beverages.
- Q: Are there accessible restrooms? | A: Yes, all restrooms including Restroom 1 have accessible stalls.
- Q: Where is the emergency exit? | A: Emergency exits are clearly marked with illuminated signs above all main concourse pathways. In an emergency, staff will direct you.
- Q: What is the current score? | A: I do not have access to live scores. Please check the stadium jumbotron or the official FIFA app for live updates.
      `;
    }

    // 3. Construct System Prompt
    const systemPrompt = `
You are the official multilingual AI assistant for the FIFA World Cup 2026 stadium.
You MUST answer the user in this language code: ${language}.
${simplifiedLanguage ? 'CRITICAL INSTRUCTION: You MUST speak as if you are talking to a 5-year-old child. Use extremely simple words. Use very short sentences. DO NOT use big words. Be very literal and basic.' : ''}
Use the GROUNDING CONTEXT below as your primary source of truth.
If the context doesn't directly answer the question, you may provide a generally helpful, common-sense answer regarding stadium operations (e.g., directing them to staff for emergencies or general policies).
DO NOT hallucinate specific stadium locations or match facts not in the context.
Keep your answers brief, polite, and helpful.

GROUNDING CONTEXT:
${groundingContext}
    `;

    // 4. Stream response from Groq
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages,
      temperature: 0.2, // Low temperature to reduce hallucinations
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
