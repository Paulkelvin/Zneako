import type { Metadata } from 'next';
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layout/Header';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zneako: The Part You Don\'t See Matters Just As Much',
  description: 'Durable children\'s trainers made with reclaimed tyre rubber. Reducing waste. Rethinking materials. Redefining footwear.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Browsers restore the previous scroll offset on reload by default
            (history.scrollRestoration === 'auto'), so refreshing a scrolled
            page lands back where you were instead of at the top. Runs inline
            and early so it takes effect before the browser's own restore.
            A URL with a #hash still scrolls to that section on load — that's
            separate, unaffected browser behavior. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`,
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
