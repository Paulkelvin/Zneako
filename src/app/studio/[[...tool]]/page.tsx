export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

import StudioPageClient from './StudioPageClient';

export default function StudioPage() {
  return <StudioPageClient />;
}
