import { defineField, defineType } from 'sanity';

// Security telemetry, not editorial content: one document per failed admin
// login, used to lock out an IP after repeated wrong passwords. Excluded
// from the Studio's document list (see structure.ts) since it's not
// something an editor needs to browse.
export default defineType({
  name: 'adminAuthAttempt',
  title: 'Admin Auth Attempt',
  type: 'document',
  fields: [
    defineField({
      name: 'ip',
      title: 'IP',
      type: 'string',
      readOnly: true,
    }),
  ],
});
