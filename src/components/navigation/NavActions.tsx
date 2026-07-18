'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ProfilePanel } from './ProfilePanel';

export function NavActions({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-4 border-l border-card-border pl-4">
      {mounted && (
        <>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-card-border transition-colors text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <ProfilePanel />
        </>
      )}

      {userEmail ? (
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400 hidden sm:inline-block">
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 text-foreground hover:text-secondary transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline-block">Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-accent text-background px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
