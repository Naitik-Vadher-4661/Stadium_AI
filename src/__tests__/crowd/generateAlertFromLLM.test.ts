import { analyzeCrowdData } from '@/lib/crowd/analyzer';
import { GateStatus } from '@/types/crowd';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('generateAlertFromLLM (via analyzeCrowdData)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates alert correctly through generateAlertFromLLM', async () => {
    const mockGateData: GateStatus[] = [
      { gate_name: 'Gate 1', status: 'critical', occupancy_percent: 95, queue_length: 50, entry_rate: 10, is_accessible: true },
      { gate_name: 'Gate 2', status: 'normal', occupancy_percent: 40, queue_length: 5, entry_rate: 15, is_accessible: true }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              alert_type: 'redirect',
              severity: 'critical',
              message: 'Gate 1 is critically full.',
              recommendation: 'Redirect to Gate 2.'
            })
          }
        }]
      })
    } as Response);

    const alerts = await analyzeCrowdData(mockGateData);

    expect(mockFetch).toHaveBeenCalled();
    const fetchArgs = mockFetch.mock.calls[0];
    const fetchBody = JSON.parse(fetchArgs[1].body);
    
    // Verify that the prompt sent to LLM correctly included critical and normal gate data
    const prompt = fetchBody.messages[0].content;
    expect(prompt).toContain('Gate 1: 95% occupancy');
    expect(prompt).toContain('Gate 2: 40% occupancy');

    // Verify output
    expect(alerts.length).toBe(1);
    expect(alerts[0].alert_type).toBe('redirect');
    expect(alerts[0].message).toBe('Gate 1 is critically full.');
    expect(alerts[0].recommendation).toBe('Redirect to Gate 2.');
  });
});
