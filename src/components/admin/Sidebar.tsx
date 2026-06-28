'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const links = [
    { href: '/admin/menu', icon: 'restaurant_menu', label: 'Menu' },
    { href: '/admin/gallery', icon: 'photo_library', label: 'Gallery' },
    { href: '/admin/reviews', icon: 'rate_review', label: 'Reviews' },
    { href: '/admin/reservations', icon: 'event_available', label: 'Reservations' },
  ];

  return (
    <>
      <nav
        className={`fixed left-0 top-0 h-screen w-sidebar-width bg-background border-r border-outline-variant flex flex-col py-md z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        id="sidebar"
      >
        <div className="px-margin mb-xl">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Motherland</h2>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Cafe Administration</p>
        </div>

        <ul className="flex-1 flex flex-col gap-base px-sm">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-md px-sm py-sm w-full font-label-md text-label-md transition-colors active:scale-95 duration-150 border-l-4 ${
                    isActive
                      ? 'text-on-surface border-primary bg-surface-container-low'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container border-transparent'
                  }`}
                  onClick={() => onClose()}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-sm mt-auto">
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' });
              window.location.reload();
            }}
            className="flex items-center gap-md px-sm py-sm w-full text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors border-l-4 border-transparent font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100 block' : 'opacity-0 hidden'
        }`}
        onClick={onClose}
      />
    </>
  );
}
