import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'howItWorksSection',
  title: 'How It Works',
  type: 'document',
  fields: [
    defineField({ name: 'tagLabel', title: 'Tag label', type: 'string' }),
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
          ],
        }),
      ],
      description: 'Icons stay hardcoded in the component, matched by array order.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'How It Works' };
    },
  },
});
