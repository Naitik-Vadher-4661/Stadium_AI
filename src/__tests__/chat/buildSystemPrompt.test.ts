import { POST } from '@/app/api/chat/route';
import { streamText } from 'ai';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('ai', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('ai');
  return {
    ...actual,
    streamText: vi.fn().mockResolvedValue({
      toDataStreamResponse: () => new Response('mock stream')
    })
  };
});

vi.mock('@/utils/rateLimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true)
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({
      data: [{ question_en: 'Where is Gate 1?', answer_en: 'At the entrance.' }]
    })
  })
}));

vi.mock('@/lib/crowd/store', () => ({
  getGateData: vi.fn().mockResolvedValue([
    { gate_name: 'Gate 1', status: 'normal', occupancy_percent: 50, queue_length: 10 }
  ])
}));

describe('buildSystemPrompt (via POST)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates system prompt with correct language and context', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        language: 'es',
        simplifiedLanguage: false
      })
    });

    await POST(req);

    expect(streamText).toHaveBeenCalled();
    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    const systemPrompt = callArgs.system;

    expect(systemPrompt).toContain('You MUST answer the user in this language code: es');
    expect(systemPrompt).toContain('LIVE GATE STATUS');
    expect(systemPrompt).toContain('Gate 1: Status is normal. Occupancy: 50%. Queue: 10 people.');
    expect(systemPrompt).toContain('Where is Gate 1? | A: At the entrance.');
    expect(systemPrompt).not.toContain('CRITICAL INSTRUCTION: You MUST speak as if you are talking to a 5-year-old child');
  });

  it('generates system prompt with simplified language constraint', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        language: 'en',
        simplifiedLanguage: true
      })
    });

    await POST(req);

    expect(streamText).toHaveBeenCalled();
    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    const systemPrompt = callArgs.system;

    expect(systemPrompt).toContain('You MUST answer the user in this language code: en');
    expect(systemPrompt).toContain('CRITICAL INSTRUCTION: You MUST speak as if you are talking to a 5-year-old child');
  });
});
