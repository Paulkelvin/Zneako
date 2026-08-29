import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'footerSection',
  title: 'Footer / Contact',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' }),
    defineField({ name: 'phone', title: 'Contact phone', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer / Contact' };
    },
  },
});
