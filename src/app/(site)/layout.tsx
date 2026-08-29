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
  title: 'Zneako — The Part You Don\'t See Matters Just As Much',
  description: 'Durable children\'s trainers made with reclaimed tyre rubber. Reducing waste. Rethinking materials. Redefining footwear.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
