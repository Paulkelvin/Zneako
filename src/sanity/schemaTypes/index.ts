import heroSection from './heroSection';
import problemSolutionSection from './problemSolutionSection';
import howItWorksSection from './howItWorksSection';
import teamStorySection from './teamStorySection';
import waitlistSection from './waitlistSection';
import sustainabilitySection from './sustainabilitySection';
import footerSection from './footerSection';
import waitlistSignup from './waitlistSignup';

export const schemaTypes = [
  heroSection,
  problemSolutionSection,
  howItWorksSection,
  teamStorySection,
  waitlistSection,
  sustainabilitySection,
  footerSection,
  waitlistSignup,
];

// _id of each singleton document — shared between the Studio structure
// (src/sanity/structure.ts), the seed script, and any page-side fetches.
export const SINGLETON_TYPES = new Set([
  'heroSection',
  'problemSolutionSection',
  'howItWorksSection',
  'teamStorySection',
  'waitlistSection',
  'sustainabilitySection',
  'footerSection',
]);
