'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Loader2, Leaf, Train, Ticket, CupSoda } from 'lucide-react';
import { useCompletion } from '@ai-sdk/react';

export default function SustainabilityPage() {
  const { language, t } = useLanguage();

  const ECO_ACTIONS = [
    { id: 'public_transit', label: t('eco.action1'), icon: <Train className="w-5 h-5" />, points: 50 },
    { id: 'digital_ticket', label: t('eco.action2'), icon: <Ticket className="w-5 h-5" />, points: 10 },
    { id: 'recycled_cup', label: t('eco.action3'), icon: <CupSoda className="w-5 h-5" />, points: 25 },
  ];
  const [loggedActions, setLoggedActions] = useState<string[]>([]);
  const lastFetchedRef = useRef<{ actions: string, lang: string }>({ actions: '', lang: '' });

  const { completion, complete, isLoading: aiLoading, error: aiError } = useCompletion({
    api: '/api/sustainability',
  });

  useEffect(() => {
    const actionsString = loggedActions.join(',');
    if (lastFetchedRef.current.actions === actionsString && lastFetchedRef.current.lang === language) {
      return;
    }
    
    lastFetchedRef.current = { actions: actionsString, lang: language };
    
    if (loggedActions.length === 0) {
      return; // Skip LLM call to save resources if they haven't logged anything
    }

    complete('recommend', {
      body: { actions: loggedActions, language }
    });
  }, [loggedActions, language, complete]);

  const toggleAction = (id: string) => {
    let newActions;
    if (loggedActions.includes(id)) {
      newActions = loggedActions.filter((a) => a !== id);
    } else {
      newActions = [...loggedActions, id];
    }
    setLoggedActions(newActions);
  };

  const totalPoints = loggedActions.reduce((total, actionId) => {
    const action = ECO_ACTIONS.find(a => a.id === actionId);
    return total + (action?.points || 0);
  }, 0);

  return (
    <div className="min-h-full bg-background flex flex-col items-center justify-center py-12 px-4 transition-colors">
      <div className="max-w-2xl w-full bg-card rounded-2xl border border-card-border p-8 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
            <Leaf className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">{t('eco.title')}</h2>
        <p className="text-center text-foreground/70 mb-8">
          {t('eco.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {ECO_ACTIONS.map((action) => {
            const isActive = loggedActions.includes(action.id);
            return (
              <button
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  isActive 
                  ? 'border-green-500 bg-green-500/10 text-green-500' 
                  : 'border-card-border bg-background text-foreground/70 hover:border-green-500/50'
                }`}
              >
                {action.icon}
                <span className="mt-2 text-sm font-semibold text-center">{action.label}</span>
                <span className="mt-1 text-xs opacity-80">+{action.points} pts</span>
              </button>
            );
          })}
        </div>

        <div className="bg-background border border-card-border rounded-xl p-6 text-center shadow-sm">
          <h3 className="font-semibold text-lg mb-1 text-primary">{t('eco.impact')}: {totalPoints}</h3>
          {aiError ? (
            <p className="text-red-400 py-4">Network error. Keep up the great work!</p>
          ) : !completion && aiLoading ? (
            <div className="flex items-center justify-center text-foreground/60 space-x-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('eco.loading')}</span>
            </div>
          ) : (
            <p className="text-foreground/80 leading-relaxed py-2 italic">
              &quot;{completion || 'Log an action to see your impact!'}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
