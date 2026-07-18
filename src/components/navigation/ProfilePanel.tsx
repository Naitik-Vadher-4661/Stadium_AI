'use client';

import { useState } from 'react';
import { User, X, Check } from 'lucide-react';
import { useFanProfile, FoodPreference, TransitPreference } from '@/components/providers/FanProfileProvider';

export function ProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteFood, setFavoriteFood, transitMode, setTransitMode } = useFanProfile();

  const FOOD_OPTIONS = ['Tacos', 'Burgers', 'Pizza', 'Vegan', 'Hot Dogs'];
  const TRANSIT_OPTIONS = ['Train', 'Bus', 'Rideshare', 'Parking'];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-card-border transition-colors text-foreground"
        aria-label="Open Profile Settings"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-card-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-card-border">
              <h3 className="font-bold text-lg text-foreground flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Fan Context Profile
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-foreground/70 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Global Favorite Food</label>
                <p className="text-xs text-foreground/60 mb-3">AI will try to recommend places that match this when possible.</p>
                <div className="flex flex-wrap gap-2">
                  {FOOD_OPTIONS.map(food => (
                    <button
                      key={food}
                      onClick={() => setFavoriteFood(food as FoodPreference)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        (favoriteFood === food)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-background border-card-border text-foreground/80 hover:border-primary/50'
                      }`}
                    >
                      {food}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Preferred Transit Mode</label>
                <p className="text-xs text-foreground/60 mb-3">AI will prioritize this mode for travel routing.</p>
                <div className="flex flex-wrap gap-2">
                  {TRANSIT_OPTIONS.map(mode => (
                    <button
                      key={mode}
                      onClick={() => setTransitMode(mode as TransitPreference)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        (transitMode === mode)
                          ? 'bg-secondary/10 border-secondary text-secondary'
                          : 'bg-background border-card-border text-foreground/80 hover:border-secondary/50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-background border-t border-card-border flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-background px-4 py-2 rounded-full font-bold flex items-center hover:opacity-90 transition-opacity"
              >
                <Check className="w-4 h-4 mr-2" />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
