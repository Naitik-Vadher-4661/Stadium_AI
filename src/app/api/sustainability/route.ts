import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimit';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const sustainabilityRequestSchema = z.object({
  actions: z.array(z.string()).max(10).optional(),
  language: z.enum(['en', 'es', 'pt', 'hi']).default('en'),
});

type SustainabilityRequest = z.infer<typeof sustainabilityRequestSchema>;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = sustainabilityRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const { actions, language }: SustainabilityRequest = parsed.data;

    const actionsList = (actions || []).join(', ');

    const systemPrompt = `You are a helpful stadium assistant.
    The fan has taken the following sustainable actions: ${actionsList || 'None yet'}.
    Calculate roughly how much carbon they saved (make a reasonable estimate for a fun gamified experience).
    Provide a 2-sentence energetic narrative thanking them and telling them their carbon savings! Compare their savings to something tangible (e.g., equivalent to planting a tree, running a fridge for a day, etc.).
    If they have no actions, encourage them to log something!
    Keep it very brief, energetic, and fun.
    IMPORTANT: You MUST respond in this language code: ${language}.`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: 'What is my carbon footprint impact?',
    });

    return NextResponse.json({ narrative: text });
  } catch (error) {
    console.error('Sustainability POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate narrative',
      narrative: 'Your environmental impact is temporarily unavailable, but your sustainable actions are recorded. Thank you!'
    }, { status: 500 });
  }
}
