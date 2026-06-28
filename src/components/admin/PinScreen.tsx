'use client';
import { useState } from 'react';

export function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      
      if (res.ok) {
        onUnlock();
      } else {
        setError(true);
        setPin('');
      }
    } catch (err) {
      setError(true);
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface-container-high rounded-2xl p-10 w-full max-w-sm text-center shadow-2xl border border-outline-variant">
        <div className="text-4xl mb-4 text-primary">
          <span className="material-symbols-outlined text-[48px]">admin_panel_settings</span>
        </div>
        <h1 className="text-primary font-headline-md text-headline-md font-semibold mb-1">Motherland</h1>
        <p className="text-on-surface-variant font-body-sm text-body-sm mb-8">Admin Access</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="Enter PIN (try 1234)"
            className={`w-full px-4 py-3 rounded-lg bg-surface text-on-surface text-center tracking-widest border ${
              error ? 'border-error' : 'border-outline-variant focus:border-primary'
            } focus:outline-none transition-colors`}
            autoFocus
          />
          {error && <p className="text-error font-body-sm text-body-sm">Incorrect admin key. Try again.</p>}
          <button
            type="submit"
            disabled={!pin || isLoading}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-bold transition-colors hover:bg-primary-fixed disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
