import 'dotenv/config';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@sanity/client';

// Node scripts don't get Next.js's automatic .env.local loading, so load it
// explicitly (falls back silently if the file is missing).
loadEnv({ path: path.resolve(process.cwd(), '.env.local') });

export const seedClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: process.env.SANITY_API_VERSION ?? '2026-02-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
