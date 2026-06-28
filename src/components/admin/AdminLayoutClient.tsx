'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const SIDEBAR_W = 200;

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/admin/check')
      .then(res => { if (res.ok) setIsUnlocked(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isMounted && isUnlocked && pathname === '/admin') {
      router.replace('/admin/menu');
    }
  }, [pathname, isUnlocked, isMounted, router]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    router.replace('/admin/menu');
  };

  if (!isMounted) return null;

  if (!isUnlocked) {
    return <PinScreen onUnlock={handleUnlock} />;
  }

  const navItems = [
    { href: '/admin/menu', icon: 'restaurant_menu', label: 'Menu' },
    { href: '/admin/gallery', icon: 'photo_library', label: 'Gallery' },
    { href: '/admin/reviews', icon: 'rate_review', label: 'Reviews' },
    { href: '/admin/reservations', icon: 'event_available', label: 'Reservations' },
  ];

  let title = 'Dashboard';
  if (pathname.includes('/menu')) title = 'Menu Management';
  if (pathname.includes('/gallery')) title = 'Gallery Management';
  if (pathname.includes('/reviews')) title = 'Reviews Management';
  if (pathname.includes('/reservations')) title = 'Reservations';

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#131313', color: '#e5e2e1', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <>
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />
        )}
        <nav style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: `${SIDEBAR_W}px`,
          background: '#131313',
          borderRight: '1px solid #4d4635',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          zIndex: 50,
          transform: isSidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 300ms ease',
        }}
          className={`${isSidebarOpen ? '' : 'max-md:-translate-x-full'}`}
        >
          <div style={{ padding: '0 20px 32px' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#f2ca50' }}>Motherland</div>
            <div style={{ fontSize: '11px', color: '#d0c5af', marginTop: '2px', letterSpacing: '0.05em' }}>Cafe Administration</div>
          </div>

          <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px', listStyle: 'none', margin: 0 }}>
            {navItems.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      borderLeft: `3px solid ${isActive ? '#f2ca50' : 'transparent'}`,
                      background: isActive ? '#201f1f' : 'transparent',
                      color: isActive ? '#e5e2e1' : '#d0c5af',
                      transition: 'all 150ms',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div style={{ padding: '0 8px' }}>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.reload();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                width: '100%',
                background: 'none',
                border: 'none',
                borderLeft: '3px solid transparent',
                borderRadius: '6px',
                color: '#d0c5af',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
              Logout
            </button>
          </div>
        </nav>
      </>

      {/* HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#131313',
        borderBottom: '1px solid #4d4635',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 0 24px',
        zIndex: 39,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: `${SIDEBAR_W}px` }}>
          {/* mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer', padding: '4px' }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span style={{
            background: '#201f1f',
            border: '1px solid #4d4635',
            borderRadius: '999px',
            padding: '2px 12px',
            fontSize: '12px',
            color: '#d0c5af',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer', borderRadius: '50%', padding: '6px' }}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2a2a2a', border: '1px solid #4d4635', overflow: 'hidden' }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5JGKNYd2RAE1hmYt-OlkqFPFgrw3tVCsTXE-LNVFvVMYlPTJ9HQ-h-xZ0Cj8JMkR1xQ7HoULJa_Iw4hgKz9S9wF2kYrGjFcqY93XGQWaocQg8kfEs99eHRDRnAPDWQLce4eXzd9_Nc56aQe9oBmgUCIzNShuueXY_rmieOyRQ4Tk3KkD-ZOCi9fiq9yXKEZlQMJM2YcbbGRl-xlW0_3f6cfWfQNh20mdtv0Hng8_BkeEgYJxXiINGKr9Fth-s7h6blZUlDFyP9g" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        marginLeft: `${SIDEBAR_W}px`,
        paddingTop: '64px',
        minHeight: '100vh',
        padding: '88px 32px 32px',
      }}>
        {children}
      </main>
    </div>
  );
}

// ─── PIN SCREEN ──────────────────────────────────────────────
function PinScreen({ onUnlock }: { onUnlock: () => void }) {
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
    } catch {
      setError(true);
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#131313',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '16px',
    }}>
      <div style={{
        background: '#1c1b1b',
        border: '1px solid #4d4635',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '380px',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#f2ca50' }}>admin_panel_settings</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#f2ca50', margin: '12px 0 4px' }}>Motherland</h1>
        <p style={{ fontSize: '13px', color: '#d0c5af', marginBottom: '32px' }}>Admin Access</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            placeholder="Enter admin password"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#131313',
              border: `1px solid ${error ? '#ffb4ab' : '#4d4635'}`,
              borderRadius: '8px',
              color: '#e5e2e1',
              fontSize: '14px',
              textAlign: 'center',
              letterSpacing: '0.1em',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ fontSize: '12px', color: '#ffb4ab', margin: 0 }}>Incorrect password. Try again.</p>}
          <button
            type="submit"
            disabled={!pin || isLoading}
            style={{
              padding: '12px',
              background: pin && !isLoading ? '#f2ca50' : '#4d4635',
              color: pin && !isLoading ? '#3c2f00' : '#d0c5af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: pin && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 200ms',
            }}
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
