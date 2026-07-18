'use client';

interface DirectionsListProps {
  directionsText: string;
  isLoading: boolean;
}

export function DirectionsList({ directionsText, isLoading }: DirectionsListProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4 border rounded-lg bg-gray-50" aria-busy="true" aria-label="Loading directions">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!directionsText) {
    return null;
  }

  return (
    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
      <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        AI Directions
      </h3>
      {/* 
        Using whitespace-pre-wrap to render the plain text with line breaks as sent by the LLM. 
      */}
      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed" aria-live="polite">
        {directionsText}
      </p>
    </div>
  );
}
