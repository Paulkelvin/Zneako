import type { StructureResolver } from 'sanity/structure';
import { SINGLETON_TYPES } from './schemaTypes';

const SINGLETON_TITLES: Record<string, string> = {
  heroSection: 'Hero',
  problemSolutionSection: 'Problem & Solution',
  howItWorksSection: 'How It Works',
  teamStorySection: 'Team & Story',
  waitlistSection: 'Waitlist',
  sustainabilitySection: 'Sustainability',
  footerSection: 'Footer / Contact',
};

// Singleton sections show as one fixed document (no create/duplicate/delete),
// so editors can't accidentally spawn a second "Hero" — everything else
// (waitlistSignup) falls back to the normal document-list view.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Zneako Content')
    .items([
      S.listItem()
        .title('Page Content')
        .child(
          S.list()
            .title('Page Content')
            .items(
              Object.entries(SINGLETON_TITLES).map(([type, title]) =>
                S.listItem()
                  .title(title)
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type))
              )
            )
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        if (id === 'adminAuthAttempt') return false;
        return id ? !SINGLETON_TYPES.has(id) : true;
      }),
    ]);
