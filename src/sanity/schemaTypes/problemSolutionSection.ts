import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'problemSolutionSection',
  title: 'Problem & Solution',
  type: 'document',
  fields: [
    defineField({ name: 'tagLabel', title: 'Tag label', type: 'string' }),
    defineField({ name: 'headlineLine1', title: 'Headline — line 1', type: 'string' }),
    defineField({ name: 'headlineLine2', title: 'Headline — line 2', type: 'string' }),

    defineField({ name: 'problemStat', title: 'Problem stat', type: 'string' }),
    defineField({ name: 'problemDescription', title: 'Problem description', type: 'text', rows: 3 }),
    defineField({ name: 'problemCitationLabel', title: 'Problem citation label', type: 'string' }),
    defineField({ name: 'problemCitationUrl', title: 'Problem citation URL', type: 'url' }),
    defineField({ name: 'bradfordFireText', title: 'Bradford fire paragraph', type: 'text', rows: 3 }),

    defineField({ name: 'solutionText', title: 'Solution paragraph', type: 'text', rows: 4 }),
    defineField({ name: 'solutionQuote', title: 'Solution quote', type: 'text', rows: 2 }),

    defineField({
      name: 'pillars',
      title: 'Supporting pillars',
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
    }),

    defineField({
      name: 'transformationCaption',
      title: 'Transformation placeholder caption',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Problem & Solution' };
    },
  },
});
