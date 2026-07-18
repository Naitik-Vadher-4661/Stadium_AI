'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export function FanAlertBanner() {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch alerts initially
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const alerts = await res.json();
          if (alerts && alerts.length > 0) {
            // Sort by timestamp descending (if available) or just take the first one
            setAlertMsg(alerts[0].message);
          }
        }
      } catch (error) {
        console.error('Failed to fetch fan alerts:', error);
      }
    };

    fetchAlerts();

    // Poll every 30 seconds for new alerts
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!alertMsg) return null;

  // Don't show the banner on the main page to keep the hero clean, 
  // or maybe we DO want to show it everywhere. Let's show it everywhere.
  return (
    <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-center text-sm font-medium z-50">
      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
      <span>{alertMsg}</span>
    </div>
  );
}
