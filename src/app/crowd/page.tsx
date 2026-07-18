'use client';

import { useState, useEffect, useRef } from 'react';
import { useFanProfile } from '@/components/providers/FanProfileProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Loader2, Utensils } from 'lucide-react';
import { useCompletion } from '@ai-sdk/react';

interface FoodStand {
  id: string;
  name: string;
  foodType: string;
  waitTimeMins: number;
}

export default function CrowdPage() {
  const { favoriteFood } = useFanProfile();
  const { language, t } = useLanguage();
  const [currentFood, setCurrentFood] = useState<string>(favoriteFood || 'Any');
  const [stands, setStands] = useState<FoodStand[]>([]);
  const [standsLoading, setStandsLoading] = useState(true);

  const lastFetchedRef = useRef<{ food: string, lang: string }>({ food: '', lang: '' });

  const { completion, complete, isLoading: aiLoading, error: aiError } = useCompletion({
    api: '/api/crowd',
  });

  // Fetch base stands data immediately on mount
  useEffect(() => {
    const fetchStands = async () => {
      setStandsLoading(true);
      try {
        const res = await fetch('/api/crowd');
        if (res.ok) {
          const data = await res.json();
          setStands(data.stands || []);
        }
      } catch (e) {
        console.error('Failed to fetch stands:', e);
      } finally {
        setStandsLoading(false);
      }
    };
    fetchStands();
  }, []);

  // Fetch AI recommendation when food or language changes
  useEffect(() => {
    if (lastFetchedRef.current.food === currentFood && lastFetchedRef.current.lang === language) {
      return;
    }
    
    lastFetchedRef.current = { food: currentFood, lang: language };
    
    complete('', {
      body: { favoriteFood: currentFood, language }
    });
  }, [currentFood, language, complete]);

  return (
    <div className="min-h-full bg-background flex flex-col md:flex-row transition-colors">
      {/* Left panel: Preferences & AI Rec */}
      <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 border-r border-card-border bg-card">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
            <Utensils className="w-6 h-6 mr-2 text-primary" />
            {t('crowd.title')}
          </h2>
          <p className="text-foreground/70 mb-6">
            {t('crowd.subtitle')}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">{t('crowd.label')}</label>
            <select
              value={currentFood}
              onChange={(e) => setCurrentFood(e.target.value)}
              className="block w-full rounded-md border border-card-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 bg-background text-foreground transition-colors"
            >
              <option value="Any">{t('crowd.any')}</option>
              <option value="Tacos">Tacos</option>
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Vegan">Vegan</option>
              <option value="Hot Dogs">Hot Dogs</option>
            </select>
          </div>

          <div className="bg-background border border-card-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-primary">{t('crowd.aiTitle')}</h3>
            {aiError ? (
              <p className="text-red-400">Recommendation temporarily unavailable.</p>
            ) : !completion && aiLoading ? (
              <div className="flex items-center text-foreground/60 space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('crowd.loading')}</span>
              </div>
            ) : (
              <p className="text-foreground/80 leading-relaxed">{completion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Heatmap / List */}
      <div className="w-full md:w-1/2 p-6 bg-background">
        <h3 className="text-xl font-bold text-foreground mb-4">{t('crowd.waitTitle')}</h3>
        <div className="space-y-4">
          {stands.map((stand) => (
            <div key={stand.id} className="bg-card border border-card-border rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-semibold text-foreground">{stand.name}</h4>
                <p className="text-xs text-foreground/60">{stand.foodType}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-lg font-bold ${stand.waitTimeMins > 10 ? 'text-red-400' : stand.waitTimeMins > 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {stand.waitTimeMins} min
                </span>
                <span className="text-xs text-foreground/50">{t('crowd.wait')}</span>
              </div>
            </div>
          ))}
          {stands.length === 0 && standsLoading && (
            <div className="text-center text-foreground/50 py-10">Loading heatmaps...</div>
          )}
        </div>
      </div>
    </div>
  );
}
