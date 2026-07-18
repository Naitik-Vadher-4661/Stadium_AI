'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Globe2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      router.push('/assistant');
      router.refresh();
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
          Fan Login
        </h2>
        <p className="mt-2 text-center text-sm text-foreground/70">
          Sign in to access your Fan Assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-card-border sm:rounded-lg sm:px-10 transition-colors">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground">Email address</label>
              <div className="mt-1">
                <input
                  id="login-email"
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
              <label htmlFor="login-password" className="block text-sm font-medium text-foreground">Password</label>
              <div className="mt-1">
                <input
                  id="login-password"
                  type="password"
                  required
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
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-background" /> : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-foreground/70">
              Need an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
