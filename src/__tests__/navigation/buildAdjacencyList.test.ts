import { findShortestPath } from '@/lib/navigation/graph';
import { StadiumLocation, StadiumEdge } from '@/types/stadium';
import { describe, it, expect } from 'vitest';

describe('buildAdjacencyList (via findShortestPath)', () => {
  const mockLocations: StadiumLocation[] = [
    { id: 'loc1', name_en: 'Entrance', type: 'gate', level: 1, is_accessible: true },
    { id: 'loc2', name_en: 'Concourse', type: 'concourse', level: 1, is_accessible: true },
    { id: 'loc3', name_en: 'Stairs', type: 'stairs', level: 2, is_accessible: false },
    { id: 'loc4', name_en: 'Seat', type: 'seat', level: 2, is_accessible: true },
  ];

  const mockEdges: StadiumEdge[] = [
    { id: 'e1', from_location_id: 'loc1', to_location_id: 'loc2', distance_meters: 10, walk_time_seconds: 15, is_accessible: true, is_bidirectional: true },
    { id: 'e2', from_location_id: 'loc2', to_location_id: 'loc3', distance_meters: 5, walk_time_seconds: 20, is_accessible: false, is_bidirectional: true },
    { id: 'e3', from_location_id: 'loc3', to_location_id: 'loc4', distance_meters: 5, walk_time_seconds: 10, is_accessible: false, is_bidirectional: true },
    { id: 'e4', from_location_id: 'loc2', to_location_id: 'loc4', distance_meters: 100, walk_time_seconds: 120, is_accessible: true, is_bidirectional: true }, // Elevator path
  ];

  it('builds full adjacency list when requiresAccessible is false', () => {
    // Should route loc1 -> loc2 -> loc3 -> loc4 taking 15 + 20 + 10 = 45 seconds
    const result = findShortestPath('loc1', 'loc4', mockLocations, mockEdges, false);
    
    expect(result).not.toBeNull();
    expect(result?.totalTimeSeconds).toBe(45);
    expect(result?.path.map(p => p.id)).toEqual(['loc1', 'loc2', 'loc3', 'loc4']);
  });

  it('builds accessible-only adjacency list when requiresAccessible is true', () => {
    // loc3 and edges e2/e3 are not accessible. 
    // Should route loc1 -> loc2 -> loc4 taking 15 + 120 = 135 seconds
    const result = findShortestPath('loc1', 'loc4', mockLocations, mockEdges, true);
    
    expect(result).not.toBeNull();
    expect(result?.totalTimeSeconds).toBe(135);
    expect(result?.path.map(p => p.id)).toEqual(['loc1', 'loc2', 'loc4']);
  });
});
