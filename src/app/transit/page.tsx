'use client';

import { useState, useEffect } from 'react';
import { useFanProfile, TransitPreference } from '@/components/providers/FanProfileProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Loader2, Train, Bus, Car } from 'lucide-react';

interface TransitRoute {
  id: string;
  mode: string;
  route: string;
  departure: string;
  status: string;
}

export default function TransitPage() {
  const { transitMode, setTransitMode } = useFanProfile();
  const { language, t } = useLanguage();
  const [recommendation, setRecommendation] = useState<string>('');
  const [schedule, setSchedule] = useState<TransitRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransit = async (mode: string) => {
      setLoading(true);
      try {
        const res = await fetch('/api/transit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transitMode: mode, language }),
        });
        if (res.ok) {
          const data = await res.json();
          setRecommendation(data.recommendation || 'Recommendation unavailable.');
          setSchedule(data.schedule);
        } else {
          setRecommendation('Could not fetch transit recommendation at this time.');
        }
      } catch (e) {
        console.error('Failed to fetch transit rec:', e);
        setRecommendation('Network error while fetching transit data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransit(transitMode);
  }, [transitMode, language]);

  return (
    <div className="min-h-full bg-background flex flex-col md:flex-row transition-colors">
      {/* Left panel: Preferences & AI Rec */}
      <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 border-r border-card-border bg-card">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
            <Train className="w-6 h-6 mr-2 text-primary" />
            {t('transit.title')}
          </h2>
          <p className="text-foreground/70 mb-6">
            {t('transit.subtitle')}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">{t('transit.label')}</label>
            <select
              value={transitMode}
              onChange={(e) => setTransitMode(e.target.value as TransitPreference)}
              className="block w-full rounded-md border border-card-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 bg-background text-foreground transition-colors"
            >
              <option value="Train">{t('transit.train')}</option>
              <option value="Bus">{t('transit.bus')}</option>
              <option value="Rideshare">{t('transit.rideshare')}</option>
              <option value="Parking">{t('transit.parking')}</option>
            </select>
          </div>

          <div className="bg-background border border-card-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-primary">{t('transit.aiTitle')}</h3>
            {loading ? (
              <div className="flex items-center text-foreground/60 space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('transit.loading')}</span>
              </div>
            ) : (
              <p className="text-foreground/80 leading-relaxed">{recommendation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Schedule List */}
      <div className="w-full md:w-1/2 p-6 bg-background">
        <h3 className="text-xl font-bold text-foreground mb-4">{t('transit.depTitle')}</h3>
        <div className="space-y-4">
          {schedule.map((route) => (
            <div key={route.id} className="bg-card border border-card-border rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  {route.mode === 'Train' ? <Train className="text-accent w-5 h-5" /> : route.mode === 'Bus' ? <Bus className="text-accent w-5 h-5" /> : <Car className="text-accent w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{route.route}</h4>
                  <p className="text-xs font-medium text-primary uppercase">{route.mode}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-foreground">{route.departure}</span>
                <span className={`text-xs ${route.status === 'On Time' ? 'text-green-400' : 'text-red-400'}`}>
                  {route.status}
                </span>
              </div>
            </div>
          ))}
          {schedule.length === 0 && loading && (
            <div className="text-center text-foreground/50 py-10">Loading schedules...</div>
          )}
        </div>
      </div>
    </div>
  );
}
