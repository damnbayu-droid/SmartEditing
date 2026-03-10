'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Languages } from 'lucide-react';

export function Header() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4 w-full" aria-label="Global">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-transparent" />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="flex items-center gap-2 font-medium"
          >
            <Languages className="h-4 w-4" />
            <span>{lang.toUpperCase()}</span>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
