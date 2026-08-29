// A separate root layout (Next.js "multiple root layouts" pattern) so
// Studio gets its own bare <html>/<body> — not the marketing site's fonts,
// globals.css, or <Header>. Sanity Studio manages its own styling.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
