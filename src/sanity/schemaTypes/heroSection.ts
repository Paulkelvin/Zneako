import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
    defineField({ name: 'ctaLabel', title: 'CTA button label', type: 'string' }),
    defineField({ name: 'tagline', title: 'Small tagline', type: 'string' }),
    defineField({ name: 'taglineSub', title: 'Tagline sub-line', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Hero' };
    },
  },
});
