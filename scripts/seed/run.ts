// Seeds Sanity content documents from the data files in ./data.
//
// Usage:
//   npm run seed              seeds every section
//   npm run seed hero         seeds only heroSection
//   npm run seed team waitlist  seeds only those two
//
// Each section is a singleton document with a fixed _id, upserted via
// createOrReplace — running this only ever touches the section(s) named,
// never the rest of the dataset. Safe to re-run any time content changes.

import fs from 'node:fs';
import path from 'node:path';
import { seedClient } from './client';
import { heroSection } from './data/heroSection';
import { problemSolutionSection } from './data/problemSolutionSection';
import { howItWorksSection } from './data/howItWorksSection';
import { buildTeamStorySection } from './data/teamStorySection';
import { waitlistSection } from './data/waitlistSection';
import { sustainabilitySection } from './data/sustainabilitySection';
import { footerSection } from './data/footerSection';

type SeedDoc = Record<string, unknown> & { _id: string; _type: string };

const REGISTRY: Record<string, () => Promise<SeedDoc> | SeedDoc> = {
  hero: () => heroSection,
  problem: () => problemSolutionSection,
  'problem-solution': () => problemSolutionSection,
  howitworks: () => howItWorksSection,
  'how-it-works': () => howItWorksSection,
  team: async () => buildTeamStorySection(await uploadOluwabusayoPhoto()),
  waitlist: () => waitlistSection,
  sustainability: () => sustainabilitySection,
  footer: () => footerSection,
};

let cachedPhotoAssetId: string | null | undefined;

async function uploadOluwabusayoPhoto(): Promise<string | null> {
  if (cachedPhotoAssetId !== undefined) return cachedPhotoAssetId;

  const filePath = path.resolve(process.cwd(), 'public/team/oluwabusayo-idowu.png');
  if (!fs.existsSync(filePath)) {
    console.warn(`  (no photo found at ${filePath} — team member will seed without one)`);
    cachedPhotoAssetId = null;
    return null;
  }

  const asset = await seedClient.assets.upload('image', fs.createReadStream(filePath), {
    filename: 'oluwabusayo-idowu.png',
  });
  cachedPhotoAssetId = asset._id;
  return asset._id;
}

async function seedOne(key: string): Promise<void> {
  const build = REGISTRY[key];
  if (!build) {
    console.error(`Unknown section "${key}". Known sections: ${Object.keys(REGISTRY).join(', ')}`);
    process.exitCode = 1;
    return;
  }
  const doc = await build();
  await seedClient.createOrReplace(doc);
  console.log(`✓ seeded ${doc._type} (_id: ${doc._id})`);
}

async function main() {
  const args = process.argv.slice(2);
  const keys = args.length > 0 ? args : ['hero', 'problem', 'howitworks', 'team', 'waitlist', 'sustainability', 'footer'];

  for (const key of keys) {
    await seedOne(key);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
