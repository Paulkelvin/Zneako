import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'sustainabilitySection',
  title: 'Sustainability',
  type: 'document',
  fields: [
    defineField({ name: 'tagLabel', title: 'Tag label', type: 'string' }),
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
    defineField({
      name: 'sdgs',
      title: 'UN Sustainable Development Goals',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'SDG number', type: 'number' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'number' },
            prepare({ title, subtitle }) {
              return { title, subtitle: `SDG ${subtitle}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Compliance frameworks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'complianceNote', title: 'Compliance note', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Sustainability' };
    },
  },
});
