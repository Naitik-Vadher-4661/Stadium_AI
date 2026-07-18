'use client';

import { PathResult, StadiumLocation } from '@/types/stadium';

interface StadiumMapProps {
  pathResult?: PathResult;
  allLocations?: StadiumLocation[];
}

export function StadiumMap({ pathResult, allLocations = [] }: StadiumMapProps) {
  // SVG coordinates bounds for scaling
  const mapWidth = 200;
  const mapHeight = 200;

  return (
    <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full"
        aria-label="Stadium Map"
        role="img"
      >
        {/* Draw a basic stadium outline for context */}
        <circle cx={100} cy={100} r={80} fill="none" stroke="#ddd" strokeWidth="2" />
        <rect x={70} y={50} width={60} height={100} fill="#eee" rx="10" />

        {/* Draw all locations if provided */}
        {allLocations.map((loc) => (
          <circle
            key={loc.id}
            cx={loc.x}
            cy={loc.y}
            r={3}
            fill="#9ca3af"
            aria-label={loc.name}
          />
        ))}

        {/* Draw path edges */}
        {pathResult?.path && pathResult.path.length > 1 && (
          <path
            d={pathResult.path
              .map((node, i) => `${i === 0 ? 'M' : 'L'} ${node.x} ${node.y}`)
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        )}

        {/* Draw path nodes */}
        {pathResult?.path &&
          pathResult.path.map((node, index) => (
            <g key={`path-${node.id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={index === 0 || index === pathResult.path.length - 1 ? 6 : 4}
                fill={index === 0 ? '#22c55e' : index === pathResult.path.length - 1 ? '#ef4444' : '#3b82f6'}
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Labels for start and end */}
              {(index === 0 || index === pathResult.path.length - 1) && (
                <text
                  x={node.x}
                  y={node.y - 10}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#1f2937"
                >
                  {node.name}
                </text>
              )}
            </g>
          ))}
      </svg>
      {/* Screen reader only text for accessibility */}
      <span className="sr-only">
        {pathResult 
          ? `Map showing path from ${pathResult.path[0].name} to ${pathResult.path[pathResult.path.length-1].name}` 
          : 'Interactive stadium map'}
      </span>
    </div>
  );
}
