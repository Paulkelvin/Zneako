import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-zneako-black border-t border-zneako-sand/10 py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold tracking-tight text-zneako-cream">
            ZNEAKO
          </p>
          <p className="mt-3 font-body text-sm text-zneako-sand/50 leading-relaxed">
            The part you don&apos;t see matters just as much.
          </p>
        </div>

        <div>
          <p className="font-body text-xs tracking-[0.15em] uppercase text-zneako-sand/40 mb-3">
            Contact
          </p>
          <a
            href="mailto:hello@zneako.com"
            className="inline-flex items-center gap-2 font-body text-sm text-zneako-sand/70 hover:text-zneako-gold transition-colors"
          >
            <Mail className="w-4 h-4" strokeWidth={1.75} />
            hello@zneako.com
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-zneako-sand/10">
        <p className="font-body text-xs text-zneako-sand/30">
          &copy; {new Date().getFullYear()} Zneako. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
