import Link from 'next/link';
import { Globe2, MessageSquare, Map as MapIcon, Users, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { TranslatedText } from '@/components/providers/TranslatedText';
import { GuestButton } from '@/components/auth/GuestButton';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <Globe2 className="text-primary w-12 h-12" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block text-foreground mb-2"><TranslatedText i18nKey="landing.headline.part1" /></span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-2">
              <TranslatedText i18nKey="landing.headline.part2" />
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-foreground/80 max-w-2xl mx-auto font-medium">
            <TranslatedText i18nKey="landing.subtitle" />
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link 
                href="/assistant" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-background bg-accent hover:opacity-90 transition-all shadow-[0_0_20px_rgba(166,255,0,0.4)]"
              >
                <TranslatedText i18nKey="landing.btn.assistant" />
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/assistant" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-background bg-accent hover:opacity-90 transition-all shadow-[0_0_20px_rgba(166,255,0,0.4)]"
                >
                  <TranslatedText i18nKey="landing.btn.getStarted" />
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <GuestButton />
              </>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          <div className="bg-card p-8 rounded-2xl border border-card-border hover:border-primary/50 transition-colors shadow-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3"><TranslatedText i18nKey="landing.feat1.title" /></h3>
            <p className="text-foreground/70">
              <TranslatedText i18nKey="landing.feat1.desc" />
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-card-border hover:border-secondary/50 transition-colors shadow-lg">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <MapIcon className="text-secondary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3"><TranslatedText i18nKey="landing.feat2.title" /></h3>
            <p className="text-foreground/70">
              <TranslatedText i18nKey="landing.feat2.desc" />
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-card-border hover:border-accent/50 transition-colors shadow-lg">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-accent w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3"><TranslatedText i18nKey="landing.feat3.title" /></h3>
            <p className="text-foreground/70">
              <TranslatedText i18nKey="landing.feat3.desc" />
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
