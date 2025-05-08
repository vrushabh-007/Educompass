'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Updated import

function Newsletter() {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const supabase = createClient(); // Initialize Supabase client

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!isChecked) {
      setStatus('error');
      setMessage('Please accept the terms and conditions');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      // Insert directly using Supabase client
      const { data, error } = await supabase
        .from('Newsletter') // Make sure 'Newsletter' table exists and has correct RLS policies
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          throw new Error('This email is already subscribed to our newsletter.');
        }
        console.error('Supabase error:', error);
        throw new Error('Failed to subscribe. Please try again later.');
      }

      // Success
      setStatus('success');
      setMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsChecked(false);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent py-12">
      <div className="container mx-auto px-4 md:px-8 text-primary-foreground text-center">
        <h2 className="text-2xl font-semibold mb-4">Subscribe to our newsletter</h2>
        <p className="mb-8">
          Get expert advice for your journey to university delivered to your inbox each month. It&apos;s short, and worthwhile - we promise!
        </p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-4 px-4 py-3 rounded-lg text-foreground bg-background/80 focus:ring-2 focus:ring-primary-foreground/50 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={status === 'loading'}
            />
            <label htmlFor="terms" className="text-sm text-primary-foreground/90">
              I confirm I am over 16 and I agree to the Terms and Conditions and Privacy Notice.
            </label>
          </div>
          
          {message && (
            <div 
              className={`mb-4 py-3 px-4 rounded-lg text-sm ${
                status === 'error' 
                  ? 'bg-destructive/20 text-destructive-foreground border border-destructive/30' 
                  : status === 'success'
                  ? 'bg-green-500/20 text-green-100 border border-green-500/30' // Assuming green for success makes sense with the theme
                  : ''
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`
              w-full bg-foreground text-background px-8 py-3 rounded-lg font-semibold
              transition duration-300
              ${status === 'loading'
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-foreground/80'
              }
            `}
          >
            {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Newsletter;
