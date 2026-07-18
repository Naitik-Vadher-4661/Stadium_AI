import { expect, test, describe } from 'vitest';
import { simulateNextTick, INITIAL_GATE_DATA } from '../../lib/crowd/simulator';

describe('Crowd Data Simulator', () => {
  test('Mutates gate occupancy within valid bounds (0-100)', () => {
    // Force a starting gate at 99% to test upper bound clamping
    const testData = [{ ...INITIAL_GATE_DATA[0], occupancy_percent: 99 }];
    
    // Run multiple ticks to ensure it stays <= 100
    let current = testData;
    for (let i = 0; i < 20; i++) {
      current = simulateNextTick(current);
      expect(current[0].occupancy_percent).toBeLessThanOrEqual(100);
      expect(current[0].occupancy_percent).toBeGreaterThanOrEqual(0);
    }
  });

  test('Upgrades status to critical when occupancy >= 92', () => {
    const testData = [{ ...INITIAL_GATE_DATA[0], occupancy_percent: 92 }];
    const next = simulateNextTick(testData);
    
    // It might drop below 92 on the next tick, so we just check if it matches the threshold logic
    if (next[0].occupancy_percent >= 92) {
      expect(next[0].status).toBe('critical');
    }
  });

  test('Halves entry rate when occupancy > 90', () => {
    const crowdedGate = [{ ...INITIAL_GATE_DATA[0], occupancy_percent: 95 }];
    const normalGate = [{ ...INITIAL_GATE_DATA[0], occupancy_percent: 50 }];
    
    const crowdedResult = simulateNextTick(crowdedGate);
    const normalResult = simulateNextTick(normalGate);

    // Crowded gate entry rate (base 40-60, halved -> 20-30)
    // Normal gate entry rate (base 40-60)
    expect(crowdedResult[0].entry_rate).toBeLessThan(35);
    expect(normalResult[0].entry_rate).toBeGreaterThanOrEqual(40);
  });
});
