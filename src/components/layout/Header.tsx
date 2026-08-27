'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useScrolled } from '@/hooks/useScrolled';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Discover', href: '#discover' },
];

function scrollToHref(href: string) {
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToHref(href);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'bg-zneako-black/70 backdrop-blur-md border-b border-zneako-sand/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 md:h-20">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="font-display text-lg md:text-xl font-bold tracking-[0.2em] text-zneako-cream"
        >
          ZNEAKO
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-body text-sm tracking-wide text-zneako-sand/80 hover:text-zneako-cream transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-zneako-cream"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-xs bg-zneako-black border-l border-zneako-sand/10 flex flex-col gap-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-16 flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <SheetClose key={link.href} asChild>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-display text-2xl font-semibold tracking-tight text-zneako-cream"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </nav>
            <p className="mt-auto pt-8 font-body text-xs tracking-[0.15em] uppercase text-zneako-sand/40">
              Giving rubber a second life.
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
