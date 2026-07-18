import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimit';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const MOCK_SCHEDULE = [
  { id: 't1', mode: 'Train', route: 'Northbound Express', departure: '9:47 PM', status: 'On Time' },
  { id: 't2', mode: 'Train', route: 'Southbound Local', departure: '10:05 PM', status: 'Delayed' },
  { id: 'b1', mode: 'Bus', route: 'Downtown Shuttle 4', departure: '9:55 PM', status: 'On Time' },
  { id: 'b2', mode: 'Bus', route: 'Airport Express', departure: '10:15 PM', status: 'On Time' },
];

const transitRequestSchema = z.object({
  transitMode: z.string().max(50).optional(),
  language: z.enum(['en', 'es', 'pt', 'hi']).default('en'),
});

type TransitRequest = z.infer<typeof transitRequestSchema>;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = transitRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const { transitMode, language }: TransitRequest = parsed.data;

    const systemPrompt = `You are a helpful stadium assistant.
    The fan's preferred transit mode is ${transitMode || 'Train'}.
    Here is the real-time departure schedule:
    ${JSON.stringify(MOCK_SCHEDULE)}
    
    Give a personalized 2-sentence recommendation on when they should leave their seat to catch their preferred transit.
    Assume it takes 15 minutes to walk from the stadium seat to the transit station.
    Be helpful and clear!
    IMPORTANT: You MUST respond in this language code: ${language}.`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: 'When should I leave?',
    });

    return NextResponse.json({ recommendation: text, schedule: MOCK_SCHEDULE });
  } catch (error) {
    console.error('Transit POST error:', error);
    // Graceful fallback: Still return the base schedule data even if AI fails
    return NextResponse.json({ 
      error: 'Failed to generate recommendation',
      recommendation: 'Recommendation temporarily unavailable.',
      schedule: MOCK_SCHEDULE 
    }, { status: 500 });
  }
}
