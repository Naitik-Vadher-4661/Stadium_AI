'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export function TranslatedText({ i18nKey }: { i18nKey: string }) {
  const { t } = useLanguage();
  return <>{t(i18nKey)}</>;
}
