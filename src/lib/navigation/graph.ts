import { StadiumLocation, StadiumEdge, PathResult } from '@/types/stadium';

/**
 * Dijkstra's algorithm to find the shortest path between two nodes in the stadium graph.
 * Weights are based on `walk_time_seconds`.
 * 
 * WHY: We use walk time instead of distance because some paths (e.g. stairs) might be shorter in distance but take longer.
 * If requiresAccessible is true, we filter out any edges or locations that are not accessible.
 */
function buildAdjacencyList(locations: StadiumLocation[], edges: StadiumEdge[]) {
  const locationMap = new Map(locations.map(loc => [loc.id, loc]));
  const adjacencyList = new Map<string, { to: string; time: number; distance: number }[]>();

  locations.forEach(loc => adjacencyList.set(loc.id, []));

  edges.forEach(edge => {
    if (locationMap.has(edge.from_location_id) && locationMap.has(edge.to_location_id)) {
      adjacencyList.get(edge.from_location_id)?.push({
        to: edge.to_location_id,
        time: edge.walk_time_seconds,
        distance: edge.distance_meters,
      });

      if (edge.is_bidirectional) {
        adjacencyList.get(edge.to_location_id)?.push({
          to: edge.from_location_id,
          time: edge.walk_time_seconds,
          distance: edge.distance_meters,
        });
      }
    }
  });

  return { locationMap, adjacencyList };
}

export function findShortestPath(
  startId: string,
  endId: string,
  locations: StadiumLocation[],
  edges: StadiumEdge[],
  requiresAccessible: boolean = false
): PathResult | null {
  // Filter out inaccessible nodes and edges if required
  const validLocations = requiresAccessible
    ? locations.filter(loc => loc.is_accessible)
    : locations;

  const validEdges = requiresAccessible
    ? edges.filter(edge => edge.is_accessible)
    : edges;

  const { locationMap, adjacencyList } = buildAdjacencyList(validLocations, validEdges);

  if (!locationMap.has(startId) || !locationMap.has(endId)) {
    return null; // Start or end not in valid locations
  }

  // Initialize distances
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const pathDetails = new Map<string, { distance: number; time: number }>();

  validLocations.forEach(loc => distances.set(loc.id, Infinity));
  distances.set(startId, 0);

  // Unvisited set
  const unvisited = new Set(validLocations.map(loc => loc.id));

  while (unvisited.size > 0) {
    // WHY: We use a simple linear scan to find the minimum distance node instead of a priority queue.
    // The stadium graph has a small, bounded number of locations (V < 1000). 
    // At this scale, O(V^2) is virtually instantaneous and avoids the overhead/complexity of a heap.
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(id => {
      const dist = distances.get(id) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = id;
      }
    });

    if (currentId === null || minDistance === Infinity) {
      break; // Unreachable nodes remain
    }

    if (currentId === endId) {
      break; // Reached target
    }

    unvisited.delete(currentId);

    const neighbors = adjacencyList.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;

      const alt = minDistance + neighbor.time;
      if (alt < (distances.get(neighbor.to) ?? Infinity)) {
        distances.set(neighbor.to, alt);
        previous.set(neighbor.to, currentId);
        
        // Track the edge details for the final tally
        const prevPathDist = pathDetails.get(currentId)?.distance ?? 0;
        const prevPathTime = pathDetails.get(currentId)?.time ?? 0;
        
        pathDetails.set(neighbor.to, {
          distance: prevPathDist + neighbor.distance,
          time: prevPathTime + neighbor.time,
        });
      }
    }
  }

  // Backtrack to build the path
  const pathIds: string[] = [];
  let curr: string | undefined = endId;
  while (curr) {
    pathIds.unshift(curr);
    curr = previous.get(curr);
  }

  if (pathIds[0] !== startId) {
    return null; // Path not found
  }

  const resultPath = pathIds.map(id => locationMap.get(id)!).filter(Boolean);
  const finalDetails = pathDetails.get(endId) ?? { distance: 0, time: 0 };

  return {
    path: resultPath,
    totalDistance: finalDetails.distance,
    totalTimeSeconds: finalDetails.time,
  };
}
