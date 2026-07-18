'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type FoodPreference = 'Tacos' | 'Burgers' | 'Pizza' | 'Vegan' | 'Hot Dogs';
export type TransitPreference = 'Train' | 'Bus' | 'Rideshare' | 'Parking';

interface FanProfileContextType {
  favoriteFood: FoodPreference;
  setFavoriteFood: (food: FoodPreference) => void;
  transitMode: TransitPreference;
  setTransitMode: (mode: TransitPreference) => void;
}

const FanProfileContext = createContext<FanProfileContextType | undefined>(undefined);

export function FanProfileProvider({ children }: { children: ReactNode }) {
  const [favoriteFood, setFavoriteFood] = useState<FoodPreference>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (window.localStorage.getItem('fan_favoriteFood') as FoodPreference) || 'Tacos';
    }
    return 'Tacos';
  });

  const [transitMode, setTransitMode] = useState<TransitPreference>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (window.localStorage.getItem('fan_transitMode') as TransitPreference) || 'Train';
    }
    return 'Train';
  });
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Save to local storage on change (only after mount to avoid overriding on initial render)
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('fan_favoriteFood', favoriteFood);
      window.localStorage.setItem('fan_transitMode', transitMode);
    }
  }, [favoriteFood, transitMode, isMounted]);

  if (!isMounted) return null;

  return (
    <FanProfileContext.Provider value={{ favoriteFood, setFavoriteFood, transitMode, setTransitMode }}>
      {children}
    </FanProfileContext.Provider>
  );
}

export function useFanProfile() {
  const context = useContext(FanProfileContext);
  if (!context) {
    throw new Error('useFanProfile must be used within a FanProfileProvider');
  }
  return context;
}
