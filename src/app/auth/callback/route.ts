import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for Supabase email confirmation.
 * When a user clicks the confirmation link in their email,
 * Supabase redirects them here with a code in the URL.
 * We exchange that code for a session and redirect to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/assistant';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's no code or exchange failed, redirect to login with an error
  return NextResponse.redirect(`${origin}/login`);
}
