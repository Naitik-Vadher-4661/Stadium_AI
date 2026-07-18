'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Globe2, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      if (authError.message.includes('rate limit')) {
        setError('Too many signup attempts. Please wait a while before trying again, or use the pre-configured admin account if you are testing.');
      } else {
        setError(authError.message);
      }
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      // Wait 3 seconds then redirect to assistant
      setTimeout(() => {
        router.push('/assistant');
        router.refresh();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Globe2 className="text-card w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Create Fan Account
        </h2>
        <p className="mt-2 text-center text-sm text-foreground/70">
          Sign up for personalized match-day assistance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-card-border sm:rounded-lg sm:px-10 transition-colors">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent/20 mb-4">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Registration Successful</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Welcome! Redirecting you to the Fan Assistant...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-foreground">Email address</label>
                <div className="mt-1">
                  <input
                    id="signup-email"
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2 bg-background border border-card-border rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-foreground">Password</label>
                <div className="mt-1">
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
                    className="appearance-none block w-full px-3 py-2 bg-background border border-card-border rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-secondary text-sm bg-secondary/10 p-3 rounded-md border border-secondary/20">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm shadow-accent/20 text-sm font-medium text-background bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-background" /> : 'Sign up'}
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm text-foreground/70">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Sign in here
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
