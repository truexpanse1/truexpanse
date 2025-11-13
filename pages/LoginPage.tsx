import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
       if (error.message.includes('Invalid login credentials')) {
         setError('Invalid login credentials. Check the setup guide below.');
      } else if (error.message.includes('fetch')) { // Catches network errors
         setError('Database connection failed. For a live deployment, ensure environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are correctly set.');
      }
      else {
        setError(error.message);
      }
    }
    // On success, the onAuthStateChange listener in App.tsx will handle the login.
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light-bg dark:bg-brand-ink p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-light-text dark:text-white">
                Massive Action Tracker
            </h1>
        </div>
        
        <div className="bg-brand-light-card dark:bg-brand-navy border border-brand-light-border dark:border-brand-gray rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 bg-brand-light-bg dark:bg-brand-ink border border-brand-light-border dark:border-brand-gray rounded-md text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 bg-brand-light-bg dark:bg-brand-ink border border-brand-light-border dark:border-brand-gray rounded-md text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {error && <p className="text-brand-red text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-brand-gray"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
        
         <div className="mt-6 text-xs text-gray-500 dark:text-gray-500 bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
          <h4 className="font-bold text-sm text-center text-brand-light-text dark:text-gray-300">First-Time Setup for Demo</h4>
          <p className="mt-2 text-center">To use the demo accounts, you must first add them to your Supabase project:</p>
          <div className="text-left mt-2 space-y-2 bg-brand-light-bg dark:bg-brand-ink p-3 rounded-md border border-brand-light-border dark:border-brand-gray">
            <p>1. Go to your Supabase project &gt; <span className="font-semibold">Authentication</span>.</p>
            <div>
              <p>2. Click '<span className="font-semibold">Add user</span>' and create the two users below:</p>
              <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                <li><span className="font-semibold text-brand-blue">Manager:</span> don@truexpanse.com / <span className="italic">password</span></li>
                <li><span className="font-semibold text-brand-blue">Rep:</span> tony@truexpanse.com / <span className="italic">password</span></li>
              </ul>
            </div>
            <p className="!mt-3 pt-2 border-t border-brand-light-border dark:border-brand-gray">3. Go to <span className="font-semibold">Table Editor &gt; users</span> table and change the <span className="font-mono">role</span> for <span className="font-semibold">don@truexpanse.com</span> to "Manager".</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;