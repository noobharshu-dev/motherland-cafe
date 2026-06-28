'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PinScreen } from './PinScreen';
import { usePathname, useRouter } from 'next/navigation';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Check if session cookie is valid via the API
    fetch('/api/admin/check')
      .then(res => {
        if (res.ok) setIsUnlocked(true);
      })
      .catch(() => {});
  }, []);

  // Redirect to menu if at root /admin
  useEffect(() => {
    if (isMounted && isUnlocked && pathname === '/admin') {
      router.replace('/admin/menu');
    }
  }, [pathname, isUnlocked, isMounted, router]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (pathname === '/admin') {
      router.replace('/admin/menu');
    }
  };

  if (!isMounted) return null;

  if (!isUnlocked) {
    return <PinScreen onUnlock={handleUnlock} />;
  }

  // Derive title from pathname
  let title = 'Dashboard';
  if (pathname.includes('/menu')) title = 'Menu Management';
  if (pathname.includes('/gallery')) title = 'Gallery Management';
  if (pathname.includes('/reviews')) title = 'Reviews Management';
  if (pathname.includes('/reservations')) title = 'Reservations Management';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden antialiased">
      <Header onMenuClick={() => setIsSidebarOpen(true)} title={title} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-20 md:ml-sidebar-width min-h-screen p-sm md:p-margin">
        {children}
      </main>
    </div>
  );
}
