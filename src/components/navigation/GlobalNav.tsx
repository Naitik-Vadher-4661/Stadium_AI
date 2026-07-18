import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Globe2 } from 'lucide-react';
import { NavActions } from './NavActions';
import { LanguageSelector } from './LanguageSelector';
import { TranslatedText } from '@/components/providers/TranslatedText';

export async function GlobalNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-card-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Globe2 className="text-card w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight hover:text-primary transition-colors">StadiumAI</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            <Link href="/assistant" className="text-foreground hover:text-secondary text-sm font-medium transition-colors">
              <TranslatedText i18nKey="nav.assistant" />
            </Link>
            <Link href="/crowd" className="text-foreground hover:text-secondary text-sm font-medium transition-colors">
              <TranslatedText i18nKey="nav.crowd" />
            </Link>
            <Link href="/transit" className="text-foreground hover:text-secondary text-sm font-medium transition-colors">
              <TranslatedText i18nKey="nav.transit" />
            </Link>
            <Link href="/sustainability" className="text-foreground hover:text-secondary text-sm font-medium transition-colors">
              <TranslatedText i18nKey="nav.sustainability" />
            </Link>
          </div>
          <LanguageSelector />
          <NavActions userEmail={user?.email} />
        </div>
      </div>
    </nav>
  );
}
