import { createClient } from '@sanity/client';

export const sanityServerClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: process.env.SANITY_API_VERSION ?? '2026-02-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
