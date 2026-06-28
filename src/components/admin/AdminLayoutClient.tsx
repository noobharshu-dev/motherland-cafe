'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
  if (!isUnlocked) return <PinScreen onUnlock={handleUnlock} />;

  const navItems = [
    { href: '/admin/menu', icon: 'restaurant_menu', label: 'Menu' },
    { href: '/admin/gallery', icon: 'photo_library', label: 'Gallery' },
    { href: '/admin/reviews', icon: 'rate_review', label: 'Reviews' },
    { href: '/admin/reservations', icon: 'event_available', label: 'Reservations' },
  ];

  let title = 'Dashboard';
  if (pathname.includes('/menu')) title = 'Menu Management';
  if (pathname.includes('/gallery')) title = 'Gallery';
  if (pathname.includes('/reviews')) title = 'Reviews';
  if (pathname.includes('/reservations')) title = 'Reservations';

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#131313', color: '#e5e2e1', minHeight: '100vh' }}>
      {/* Overlay */}
      <div
        className={`admin-overlay ${isSidebarOpen ? 'overlay-open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <nav className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#f2ca50' }}>Motherland</div>
          <div style={{ fontSize: '11px', color: '#d0c5af', marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Cafe Administration</div>
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
                    gap: '16px',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    borderLeft: `3px solid ${isActive ? '#f2ca50' : 'transparent'}`,
                    background: isActive ? '#1c1b1b' : 'transparent',
                    color: isActive ? '#e5e2e1' : '#d0c5af',
                    transition: 'all 150ms',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
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
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '12px 16px', width: '100%',
              background: 'none', border: 'none', borderLeft: '3px solid transparent',
              borderRadius: '6px', color: '#d0c5af',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer', padding: '4px', lineHeight: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
          </button>
          <span style={{
            background: '#201f1f', border: '1px solid #4d4635',
            borderRadius: '999px', padding: '3px 14px',
            fontSize: '12px', color: '#d0c5af', fontWeight: 600, letterSpacing: '0.04em',
          }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer', borderRadius: '50%', padding: '6px', lineHeight: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>refresh</span>
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2a2a2a', border: '1px solid #4d4635', overflow: 'hidden' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5JGKNYd2RAE1hmYt-OlkqFPFgrw3tVCsTXE-LNVFvVMYlPTJ9HQ-h-xZ0Cj8JMkR1xQ7HoULJa_Iw4hgKz9S9wF2kYrGjFcqY93XGQWaocQg8kfEs99eHRDRnAPDWQLce4eXzd9_Nc56aQe9oBmgUCIzNShuueXY_rmieOyRQ4Tk3KkD-ZOCi9fiq9yXKEZlQMJM2YcbbGRl-xlW0_3f6cfWfQNh20mdtv0Hng8_BkeEgYJxXiINGKr9Fth-s7h6blZUlDFyP9g"
              alt="Admin"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
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
      position: 'fixed', inset: 0,
      background: '#131313',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '16px',
    }}>
      <div style={{
        background: '#1c1b1b', border: '1px solid #4d4635',
        borderRadius: '20px', padding: '48px 40px',
        width: '100%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#f2ca50', display: 'block', marginBottom: '12px' }}>admin_panel_settings</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#f2ca50', margin: '0 0 6px' }}>Motherland</h1>
        <p style={{ fontSize: '13px', color: '#d0c5af', marginBottom: '36px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Access</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            placeholder="Enter admin password"
            autoFocus
            style={{
              width: '100%', padding: '14px 16px',
              background: '#131313', border: `1px solid ${error ? '#ffb4ab' : '#4d4635'}`,
              borderRadius: '10px', color: '#e5e2e1',
              fontSize: '15px', textAlign: 'center',
              outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {error && <p style={{ fontSize: '12px', color: '#ffb4ab', margin: 0 }}>Incorrect password. Try again.</p>}
          <button
            type="submit"
            disabled={!pin || isLoading}
            style={{
              padding: '14px',
              background: (pin && !isLoading) ? '#f2ca50' : '#4d4635',
              color: (pin && !isLoading) ? '#3c2f00' : '#d0c5af',
              border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em',
              cursor: (pin && !isLoading) ? 'pointer' : 'not-allowed',
              transition: 'all 200ms', fontFamily: "'Inter', sans-serif",
            }}
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
