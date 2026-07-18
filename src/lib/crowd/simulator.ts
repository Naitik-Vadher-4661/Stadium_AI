import { GateStatus, GateStatusType } from '@/types/crowd';

/**
 * Simulates real-time crowd dynamics at gates.
 * In a real scenario, this data would come from turnstiles and camera sensors.
 * 
 * WHY: We need realistic, fluctuating data to trigger the GenAI alerts.
 */
export function simulateNextTick(currentData: GateStatus[]): GateStatus[] {
  return currentData.map((gate) => {
    // Randomly fluctuate occupancy by -3% to +5%
    const change = (Math.random() * 8) - 3;
    let newOccupancy = gate.occupancy_percent + change;
    
    // Clamp between 0 and 100
    newOccupancy = Math.max(0, Math.min(100, newOccupancy));

    // Queue length roughly correlates with occupancy > 70%
    let newQueue = gate.queue_length;
    if (newOccupancy > 80) {
      newQueue += Math.floor(Math.random() * 20); // Queue grows
    } else if (newOccupancy < 60) {
      newQueue -= Math.floor(Math.random() * 15); // Queue shrinks
    } else {
      newQueue += Math.floor(Math.random() * 10) - 5; // Fluctuates
    }
    newQueue = Math.max(0, newQueue); // Never negative

    // Entry rate slows down as occupancy gets very high (congestion)
    let newEntryRate = 40 + (Math.random() * 20); // Base 40-60 people/min
    if (newOccupancy > 90) {
      newEntryRate *= 0.5; // Halved entry rate due to crowding
    }

    // Determine status
    let status: GateStatusType = 'normal';
    if (newOccupancy >= 92) {
      status = 'critical';
    } else if (newOccupancy >= 80) {
      status = 'warning';
    }

    return {
      ...gate,
      occupancy_percent: Number(newOccupancy.toFixed(1)),
      queue_length: newQueue,
      entry_rate: Number(newEntryRate.toFixed(1)),
      status,
      updated_at: new Date().toISOString(),
    };
  });
}

// Initial seed data for the simulator
export const INITIAL_GATE_DATA: GateStatus[] = [
  {
    id: 'g1',
    gate_name: 'Gate 1 (Main)',
    occupancy_percent: 45,
    queue_length: 20,
    entry_rate: 55,
    max_capacity: 5000,
    status: 'normal',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g2',
    gate_name: 'Gate 2 (VIP)',
    occupancy_percent: 20,
    queue_length: 5,
    entry_rate: 30,
    max_capacity: 1000,
    status: 'normal',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g3',
    gate_name: 'Gate 3 (North)',
    occupancy_percent: 85, // Starts near warning
    queue_length: 150,
    entry_rate: 45,
    max_capacity: 3500,
    status: 'warning',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g4',
    gate_name: 'Gate 4 (South)',
    occupancy_percent: 60,
    queue_length: 40,
    entry_rate: 50,
    max_capacity: 3500,
    status: 'normal',
    updated_at: new Date().toISOString(),
  },
];
