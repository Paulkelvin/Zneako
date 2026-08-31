import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-zneako-black border-t border-white/10 py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <div className="max-w-sm">
          <Image
            src="/brand/zneako-logo-lockup.png"
            alt="Zneako"
            width={719}
            height={163}
            className="h-8 w-auto"
          />
          <p className="mt-3 font-body text-sm text-zneako-sand/70 leading-relaxed">
            The part you don&apos;t see matters just as much.
          </p>
          <a
            href="https://www.linkedin.com/company/zneako/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zneako on LinkedIn"
            className="mt-4 inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-zneako-sand hover:text-zneako-orange hover:border-zneako-orange/40 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-zneako-sand/50 mb-1">
            Contact
          </p>
          <a
            href="mailto:Oluwabusayo.idowu@zneako.com"
            className="inline-flex items-center gap-2 font-body text-sm text-zneako-sand hover:text-zneako-orange transition-colors"
          >
            <Mail className="w-4 h-4" strokeWidth={1.75} />
            Oluwabusayo.idowu@zneako.com
          </a>
          <a
            href="tel:+447310014497"
            className="inline-flex items-center gap-2 font-body text-sm text-zneako-sand hover:text-zneako-orange transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={1.75} />
            +44 7310 014497
          </a>
          <p className="inline-flex items-center gap-2 font-body text-sm text-zneako-sand">
            <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            Bradford, United Kingdom
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10">
        <p className="font-body text-xs text-zneako-sand/50">
          &copy; {new Date().getFullYear()} Zneako. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
