'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { StadiumMap } from '@/components/navigation/StadiumMap';
import { DirectionsList } from '@/components/navigation/DirectionsList';
import { PathResult, StadiumLocation } from '@/types/stadium';
import { MapPin } from 'lucide-react';

import { useLanguage } from '@/components/providers/LanguageProvider';

// For the MVP, we pass the same mock locations we used in the API route
const MOCK_LOCATIONS: StadiumLocation[] = [
  { id: '1', name: 'Gate 1', category: 'gate', x: 20, y: 150, floor: 1, is_accessible: true },
  { id: '2', name: 'Section 112', category: 'seating', x: 100, y: 40, floor: 1, is_accessible: true },
  { id: '3', name: 'Food Court A', category: 'food', x: 160, y: 140, floor: 2, is_accessible: true },
];

export default function AssistantPage() {
  const { t, language } = useLanguage();
  const [pathResult, setPathResult] = useState<PathResult | undefined>();
  const [directionsText, setDirectionsText] = useState<string>('');
  const [isLoadingPath, setIsLoadingPath] = useState(false);

  // A helper function to demo the navigation feature since we don't have natural language to intent parsing fully hooked up in this MVP.
  // In a full build, the Groq API would extract 'from' and 'to' and call this via tool calling.
  const demoNavigate = async () => {
    setIsLoadingPath(true);
    setDirectionsText('');
    try {
      const res = await fetch('/api/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startId: '1', endId: '3', language: language }),
      });
      if (res.ok) {
        const data = await res.json();
        setPathResult({
          path: data.path,
          totalDistance: data.totalDistance,
          totalTimeSeconds: data.totalTimeSeconds,
        });
        setDirectionsText(data.directions);
      }
    } catch (e) {
      console.error('Navigation demo failed:', e);
    } finally {
      setIsLoadingPath(false);
    }
  };

  return (
    <div className="min-h-full bg-background flex flex-col md:flex-row transition-colors">
      {/* Left panel: Chat */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center border-r border-card-border">
        <ChatWindow />
      </div>

      {/* Right panel: Map & Context */}
      <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 bg-card overflow-y-auto transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-primary" />
            {t('map.title')}
          </h2>
          <p className="text-foreground/70 mb-4">
            {t('map.subtitle')}
          </p>
          <button 
            onClick={demoNavigate}
            disabled={isLoadingPath}
            className="mb-4 bg-accent/10 text-accent font-medium py-2 px-4 rounded hover:bg-accent/20 transition-colors border border-accent/20 shadow-[0_0_15px_rgba(166,255,0,0.15)]"
          >
            {t('map.demoBtn')}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto p-4 bg-background rounded-xl border border-card-border">
          <StadiumMap pathResult={pathResult} allLocations={MOCK_LOCATIONS} />
        </div>

        {(isLoadingPath || directionsText) && (
          <div className="mt-4">
            <DirectionsList directionsText={directionsText} isLoading={isLoadingPath} />
          </div>
        )}
      </div>
    </div>
  );
}
