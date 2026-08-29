import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'teamStorySection',
  title: 'Team & Story',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow label', type: 'string' }),
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),
    defineField({ name: 'storyParagraph1', title: 'Story — paragraph 1', type: 'text', rows: 4 }),
    defineField({ name: 'storyParagraph2', title: 'Story — paragraph 2', type: 'text', rows: 4 }),
    defineField({ name: 'citationLabel', title: 'Citation label', type: 'string' }),
    defineField({ name: 'citationUrl', title: 'Citation URL', type: 'url' }),
    defineField({ name: 'grantBadgeText', title: 'Grant badge text', type: 'string' }),
    defineField({
      name: 'team',
      title: 'Team members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
            defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'photo' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Team & Story' };
    },
  },
});
