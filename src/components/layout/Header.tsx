'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4 w-full" aria-label="Global">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-transparent" />
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
