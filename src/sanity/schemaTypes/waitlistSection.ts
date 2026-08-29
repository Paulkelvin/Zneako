import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'waitlistSection',
  title: 'Waitlist',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow label', type: 'string' }),
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),
    defineField({ name: 'pitchShort', title: 'Pitch copy (mobile, short)', type: 'text', rows: 2 }),
    defineField({ name: 'pitchFull', title: 'Pitch copy (desktop, full)', type: 'text', rows: 3 }),
    defineField({ name: 'pairsAvailable', title: 'Pairs available', type: 'number' }),
    defineField({ name: 'successHeadline', title: 'Success — headline', type: 'string' }),
    defineField({ name: 'successSubMobile', title: 'Success — sub-line (mobile)', type: 'string' }),
    defineField({ name: 'successSubDesktop', title: 'Success — sub-line (desktop)', type: 'text', rows: 2 }),
    defineField({ name: 'disclaimerText', title: 'Form disclaimer', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Waitlist' };
    },
  },
});
