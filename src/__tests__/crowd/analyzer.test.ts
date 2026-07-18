import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeCrowdData } from '../../lib/crowd/analyzer';
import { GateStatus } from '../../types/crowd';

describe('analyzeCrowdData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty array if no critical/warning gates', async () => {
    const data: GateStatus[] = [
      { id: '1', gate_name: 'Gate 1', occupancy_percent: 10, queue_length: 5, entry_rate: 20, max_capacity: 100, status: 'normal', updated_at: '' },
    ];
    const result = await analyzeCrowdData(data);
    expect(result).toEqual([]);
  });

  it('should call Groq and return an alert if there are critical gates', async () => {
    const mockGroqResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              alert_type: 'capacity_warning',
              severity: 'critical',
              message: 'Gate 1 is at critical capacity.',
              recommendation: 'Redirect to Gate 2',
            }),
          },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGroqResponse),
    });

    const data: GateStatus[] = [
      { id: '1', gate_name: 'Gate 1', occupancy_percent: 95, queue_length: 50, entry_rate: 5, max_capacity: 100, status: 'critical', updated_at: '' },
      { id: '2', gate_name: 'Gate 2', occupancy_percent: 10, queue_length: 5, entry_rate: 20, max_capacity: 100, status: 'normal', updated_at: '' },
    ];

    const result = await analyzeCrowdData(data);
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].alert_type).toBe('capacity_warning');
    expect(result[0].severity).toBe('critical');
    expect(result[0].affected_gates).toContain('Gate 1');
  });

  it('should return a fallback alert if Groq fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const data: GateStatus[] = [
      { id: '1', gate_name: 'Gate 1', occupancy_percent: 95, queue_length: 50, entry_rate: 5, max_capacity: 100, status: 'critical', updated_at: '' },
    ];

    const result = await analyzeCrowdData(data);
    
    expect(result).toHaveLength(1);
    expect(result[0].alert_type).toBe('capacity_warning');
    expect(result[0].message).toContain('System Fallback');
  });
});
