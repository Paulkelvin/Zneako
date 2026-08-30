'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useScrolled } from '@/hooks/useScrolled';
import { scrollToHref } from '@/lib/scrollToHref';
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
          ? 'bg-zneako-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 md:h-20">
        <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex items-center">
          <Image
            src="/brand/zneako-logo-lockup.png"
            alt="Zneako"
            width={719}
            height={163}
            priority
            className="h-8 md:h-9 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`font-body text-sm tracking-wide hover:text-zneako-orange transition-colors duration-300 ${
                scrolled ? 'text-zneako-sand' : 'text-black/60'
              }`}
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
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 transition-colors duration-500 ${
                scrolled ? 'text-white' : 'text-zneako-black'
              }`}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-xs bg-zneako-black border-l border-white/10 flex flex-col gap-0 top-16 bottom-0 h-auto"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-16 flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <SheetClose key={link.href} asChild>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-display text-2xl font-semibold tracking-tight text-white"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </nav>
            <p className="mt-auto pt-8 font-body text-xs tracking-[0.15em] uppercase text-zneako-sand/60">
              Giving rubber a second life.
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
