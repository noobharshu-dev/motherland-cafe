'use client';

export function Header({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:pl-sidebar-width bg-background border-b border-outline-variant h-20 flex justify-between items-center px-margin transition-all duration-300">
      <div className="flex items-center gap-sm">
        <button
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="font-headline-md text-headline-md text-primary font-bold hidden sm:block">Motherland</h1>
        <span className="sm:ml-sm px-sm py-1 bg-surface-container-high rounded-full font-label-md text-label-md text-on-surface-variant">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-sm">
        <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded-full transition-all p-xs active:opacity-80">
          <span className="material-symbols-outlined">refresh</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
          <img
            alt="Admin Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5JGKNYd2RAE1hmYt-OlkqFPFgrw3tVCsTXE-LNVFvVMYlPTJ9HQ-h-xZ0Cj8JMkR1xQ7HoULJa_Iw4hgKz9S9wF2kYrGjFcqY93XGQWaocQg8kfEs99eHRDRnAPDWQLce4eXzd9_Nc56aQe9oBmgUCIzNShuueXY_rmieOyRQ4Tk3KkD-ZOCi9fiq9yXKEZlQMJM2YcbbGRl-xlW0_3f6cfWfQNh20mdtv0Hng8_BkeEgYJxXiINGKr9Fth-s7h6blZUlDFyP9g"
          />
        </div>
      </div>
    </header>
  );
}
