import { NextResponse } from 'next/server';
import { findShortestPath } from '@/lib/navigation/graph';
import { generateDirectionsFromPath } from '@/lib/navigation/directions';
import { StadiumLocation, StadiumEdge } from '@/types/stadium';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const navigateSchema = z.object({
  startId: z.string().min(1),
  endId: z.string().min(1),
  requiresAccessible: z.boolean().default(false),
  language: z.enum(['en', 'es', 'pt', 'hi']).default('en'),
});

type NavigateRequest = z.infer<typeof navigateSchema>;

const MOCK_LOCATIONS: StadiumLocation[] = [
  { id: '1', name: 'Gate 1', category: 'gate', floor: 1, x: 10, y: 10, is_accessible: true },
  { id: 'section_112', name: 'Section 112', category: 'seating', floor: 1, x: 30, y: 10, is_accessible: true },
  { id: '3', name: 'Food Court A', category: 'food', floor: 2, x: 50, y: 30, is_accessible: true },
  { id: 'restroom_1', name: 'Restroom 1', category: 'restroom', floor: 1, x: 20, y: 20, is_accessible: true }
];

const MOCK_EDGES: StadiumEdge[] = [
  { id: 'e1', from_location_id: '1', to_location_id: 'section_112', distance_meters: 20, walk_time_seconds: 30, is_accessible: true, is_bidirectional: true },
  { id: 'e2', from_location_id: 'section_112', to_location_id: 'restroom_1', distance_meters: 15, walk_time_seconds: 20, is_accessible: true, is_bidirectional: true },
  { id: 'e3', from_location_id: 'restroom_1', to_location_id: '3', distance_meters: 40, walk_time_seconds: 60, is_accessible: true, is_bidirectional: true }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = navigateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const { startId, endId, requiresAccessible, language }: NavigateRequest = parsed.data;

    const supabase = await createClient();
    
    const [locationsResult, edgesResult] = await Promise.all([
      supabase.from('stadium_locations').select('*'),
      supabase.from('stadium_edges').select('*')
    ]);

    let locations = locationsResult.data as StadiumLocation[];
    let edges = edgesResult.data as StadiumEdge[];

    if (locationsResult.error || edgesResult.error || !locations || locations.length === 0) {
      console.warn('Navigation fallback triggered: Using mock locations and edges due to DB error or empty data.', { locError: locationsResult.error, edgeError: edgesResult.error });
      locations = MOCK_LOCATIONS;
      edges = MOCK_EDGES;
    }

    const pathResult = findShortestPath(startId, endId, locations, edges, requiresAccessible);

    if (!pathResult) {
      return NextResponse.json({ error: 'No path found between the specified locations.' }, { status: 404 });
    }

    const directions = await generateDirectionsFromPath(pathResult, language);

    return NextResponse.json({
      path: pathResult.path,
      totalDistance: pathResult.totalDistance,
      totalTimeSeconds: pathResult.totalTimeSeconds,
      directions,
    });
  } catch (error) {
    console.error('Navigation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
