

import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
    onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (isLoginView) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
      // On success, the onAuthStateChange listener in App.tsx will handle closing the modal
    } else {
      // Sign up new user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // This data is passed to the database trigger
          },
        },
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign-up successful! Please check your email to confirm your account.');
        setIsLoginView(true); // Switch to login view after successful sign-up
      }
    }
    setIsLoading(false);
  };
  
  const toggleView = () => {
      setIsLoginView(!isLoginView);
      setError('');
      setMessage('');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
        <div className="bg-brand-light-card dark:bg-brand-navy border border-brand-light-border dark:border-brand-gray rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-light-text dark:text-white">
              {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isLoginView ? "Log in to track your actions and dominate your day." : "Join the ranks of high-performers and start your journey."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-brand-light-bg dark:bg-brand-ink border border-brand-light-border dark:border-brand-gray rounded-md text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            )}
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-brand-light-bg dark:bg-brand-ink border border-brand-light-border dark:border-brand-gray rounded-md text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-brand-blue"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /><path d="M10 17a9.953 9.953 0 01-4.522-.997l1.523-1.523a4 4 0 005.9-5.9l1.523-1.523A9.953 9.953 0 0110 17z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-brand-red text-sm text-center">{error}</p>}
            {message && <p className="text-brand-lime text-sm text-center">{message}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-brand-gray"
              >
                {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up & Get Started')}
              </button>
            </div>
          </form>
           <div className="mt-6 text-center">
              <button onClick={toggleView} className="text-sm text-brand-blue hover:underline font-semibold">
                {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
