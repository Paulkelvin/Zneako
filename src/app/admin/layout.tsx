import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Zneako Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-zneako-cream">{children}</body>
    </html>
  );
}
