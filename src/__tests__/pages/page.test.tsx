import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '../utils/test-utils';
import Page from '@/app/page';

// Mock Next.js Link component since we are not in a real router context
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    },
  })),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInAnonymously: vi.fn(() => Promise.resolve({ error: null })),
    },
  })),
}));

describe('Landing Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders main title and subtitle', async () => {
    const ResolvedPage = await Page();
    render(ResolvedPage);
    
    // Check if the title exists
    expect(screen.getByText(/Future of Fan Experience/i)).toBeTruthy();
    
    // Check for subtitle text
    expect(screen.getByText(/Your personal, AI-powered stadium assistant/i)).toBeTruthy();
  });

  it('renders Guest Login button', async () => {
    const ResolvedPage = await Page();
    render(ResolvedPage);
    
    // Should render the GuestButton (mocked or full component)
    expect(screen.getByText(/Continue as Guest/i)).toBeTruthy();
  });
});
