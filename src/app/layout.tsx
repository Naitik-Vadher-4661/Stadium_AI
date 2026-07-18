import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import "./globals.css";
import { GlobalNav } from '@/components/navigation/GlobalNav';
import { AccessibilityProvider } from '@/hooks/useAccessibility';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { FanProfileProvider } from '@/components/providers/FanProfileProvider';

export const metadata: Metadata = {
  title: "StadiumAI — GenAI-Powered Stadium Operations for FIFA World Cup 2026",
  description: "AI-powered multilingual fan assistance, intelligent navigation, and real-time crowd intelligence for FIFA World Cup 2026 stadium operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors" suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <LanguageProvider>
            <AccessibilityProvider>
              <FanProfileProvider>
                <GlobalNav />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <AccessibilityPanel />
              </FanProfileProvider>
            </AccessibilityProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
