import { NextResponse } from 'next/server';
import { getGateData } from '@/lib/crowd/store';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { checkRateLimit } from '@/utils/rateLimit';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const data = await getGateData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching crowd data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const MOCK_FOOD_STANDS = [
  { id: 'stand_1', name: 'Main Concourse Burgers', foodType: 'Burgers', waitTimeMins: 15 },
  { id: 'stand_2', name: 'Upper Deck Pizza', foodType: 'Pizza', waitTimeMins: 5 },
  { id: 'stand_3', name: 'East Gate Tacos', foodType: 'Tacos', waitTimeMins: 2 },
  { id: 'stand_4', name: 'West Gate Vegan', foodType: 'Vegan', waitTimeMins: 8 },
  { id: 'stand_5', name: 'South End Hot Dogs', foodType: 'Hot Dogs', waitTimeMins: 20 },
];

const crowdRequestSchema = z.object({
  favoriteFood: z.string().max(100).optional(),
  language: z.enum(['en', 'es', 'pt', 'hi']).default('en'),
});

type CrowdRequest = z.infer<typeof crowdRequestSchema>;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = crowdRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const { favoriteFood, language }: CrowdRequest = parsed.data;

    const systemPrompt = `You are a helpful stadium assistant.
    The fan's favorite food is ${favoriteFood || 'anything'}.
    Here is the real-time data for the food stands:
    ${JSON.stringify(MOCK_FOOD_STANDS)}
    
    Give a very short (2 sentences max) recommendation on where they should go to eat right now. 
    Prioritize short wait times, but heavily factor in their favorite food if it has a reasonable wait time (under 10 mins).
    Be energetic and enthusiastic!
    IMPORTANT: You MUST respond in this language code: ${language}.`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: 'Where should I go to eat?',
    });

    return NextResponse.json({ recommendation: text, stands: MOCK_FOOD_STANDS });
  } catch (error) {
    console.error('Crowd POST error:', error);
    // Graceful fallback: Still return the base stands data even if AI fails
    return NextResponse.json({ 
      error: 'Failed to generate recommendation',
      recommendation: 'Recommendation temporarily unavailable.',
      stands: MOCK_FOOD_STANDS 
    }, { status: 500 });
  }
}
