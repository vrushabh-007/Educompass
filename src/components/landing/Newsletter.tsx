
'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      // Use 'Newsletter' table as per schema
      const { error } = await supabase.from('Newsletter').insert({ email });
      
      if (error) {
        // Handle potential duplicate email error (23505 is PostgreSQL's unique_violation code)
        if (error.code === '23505') {
            throw new Error('This email is already subscribed.');
        }
        throw error;
      }

      setStatus('success');
      setMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsChecked(false);
    } catch (error: any) {
      console.error("Newsletter submission error:", error.message);
      setStatus('error');
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-8 text-primary-foreground text-center">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Subscribe to our newsletter</h2>
        <p className="mb-8 text-muted-foreground">
          Get expert advice for your journey to university delivered to your inbox each month. It&apos;s short, and worthwhile - we promise!
        </p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-4 px-4 py-3 rounded-lg text-foreground bg-transparent/30 backdrop-blur-sm border border-border/50 focus:ring-2 focus:ring-primary-foreground/50 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={status === 'loading'}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I confirm I am over 16 and I agree to the Terms and Conditions and Privacy Notice.
            </label>
          </div>
          
          {message && (
            <div 
              className={`mb-4 py-3 px-4 rounded-lg text-sm ${
                status === 'error' 
                  ? 'bg-destructive/20 text-destructive-foreground border border-destructive/30' 
                  : status === 'success'
                  ? 'bg-green-500/20 text-green-100 border border-green-500/30'
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
