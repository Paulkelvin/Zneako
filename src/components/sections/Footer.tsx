import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

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
