export type LocationCategory =
  | 'gate'
  | 'seating'
  | 'restroom'
  | 'food'
  | 'medical'
  | 'transport'
  | 'general';

export interface StadiumLocation {
  id: string;
  name: string;
  name_es?: string;
  name_pt?: string;
  name_hi?: string;
  category: LocationCategory;
  x: number;
  y: number;
  floor: number;
  is_accessible: boolean;
  description?: string;
}

export interface StadiumEdge {
  id: string;
  from_location_id: string;
  to_location_id: string;
  distance_meters: number;
  walk_time_seconds: number;
  is_accessible: boolean;
  is_bidirectional: boolean;
}

export interface PathResult {
  path: StadiumLocation[];
  totalDistance: number;
  totalTimeSeconds: number;
}
