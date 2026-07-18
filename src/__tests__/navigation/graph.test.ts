import { expect, test, describe } from 'vitest';
import { findShortestPath } from '../../lib/navigation/graph';
import { StadiumLocation, StadiumEdge } from '../../types/stadium';

describe('Dijkstra Graph Pathfinding', () => {
  const mockLocations: StadiumLocation[] = [
    { id: '1', name: 'Gate 1', category: 'gate', x: 0, y: 0, floor: 1, is_accessible: true },
    { id: '2', name: 'Stairs', category: 'general', x: 10, y: 0, floor: 1, is_accessible: false },
    { id: '3', name: 'Elevator', category: 'general', x: 10, y: 10, floor: 1, is_accessible: true },
    { id: '4', name: 'Section 101', category: 'seating', x: 20, y: 0, floor: 2, is_accessible: true },
  ];

  const mockEdges: StadiumEdge[] = [
    // Fast but stairs (not accessible)
    { id: 'e1', from_location_id: '1', to_location_id: '2', distance_meters: 10, walk_time_seconds: 10, is_accessible: false, is_bidirectional: true },
    { id: 'e2', from_location_id: '2', to_location_id: '4', distance_meters: 10, walk_time_seconds: 15, is_accessible: false, is_bidirectional: true },
    
    // Slow but elevator (accessible)
    { id: 'e3', from_location_id: '1', to_location_id: '3', distance_meters: 15, walk_time_seconds: 20, is_accessible: true, is_bidirectional: true },
    { id: 'e4', from_location_id: '3', to_location_id: '4', distance_meters: 15, walk_time_seconds: 30, is_accessible: true, is_bidirectional: true },
  ];

  test('Finds shortest path by time (ignoring accessibility)', () => {
    const result = findShortestPath('1', '4', mockLocations, mockEdges, false);
    
    expect(result).not.toBeNull();
    expect(result?.totalTimeSeconds).toBe(25); // 10 + 15 (Stairs route)
    expect(result?.path.map(n => n.id)).toEqual(['1', '2', '4']);
  });

  test('Finds accessible path when requested', () => {
    const result = findShortestPath('1', '4', mockLocations, mockEdges, true);
    
    expect(result).not.toBeNull();
    expect(result?.totalTimeSeconds).toBe(50); // 20 + 30 (Elevator route)
    expect(result?.path.map(n => n.id)).toEqual(['1', '3', '4']);
  });

  test('Returns null when no path exists', () => {
    const disconnectedEdges: StadiumEdge[] = [mockEdges[0]]; // No path to 4
    const result = findShortestPath('1', '4', mockLocations, disconnectedEdges, false);
    
    expect(result).toBeNull();
  });
});
