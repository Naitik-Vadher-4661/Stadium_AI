'use client';

import { useLanguage, SupportedLanguage } from '@/components/providers/LanguageProvider';

interface LanguageSelectorProps {
  disabled?: boolean;
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export function LanguageSelector({ disabled }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="lang-select" className="sr-only">
        Select Language
      </label>
      <select
        id="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        disabled={disabled}
        className="block w-full rounded-md border border-card-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Language Selector"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} suppressHydrationWarning>
            {lang.native} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
}
