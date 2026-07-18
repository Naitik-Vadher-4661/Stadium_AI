'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TranslatedText } from '@/components/providers/TranslatedText';
import { Loader2 } from 'lucide-react';

export function GuestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Anonymous sign in failed:', error);
      // Fallback: Just navigate if auth fails (e.g., anon disabled)
      router.push('/assistant');
    } else {
      router.push('/assistant');
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleGuestLogin}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-8 py-4 border-2 border-card-border text-lg font-bold rounded-full text-foreground bg-card hover:border-primary/50 hover:bg-card-border transition-all disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TranslatedText i18nKey="landing.btn.guest" />}
    </button>
  );
}
