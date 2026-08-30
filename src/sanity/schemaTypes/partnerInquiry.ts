import { defineField, defineType } from 'sanity';

// Written by src/app/api/partner/route.ts, not edited here — this schema
// exists so admins can browse inquiries in Studio (and the /admin dashboard),
// not so it can be authored from scratch there.
export default defineType({
  name: 'partnerInquiry',
  title: 'Partner Inquiries',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'organization', title: 'Company / Organization', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', readOnly: true }),
    defineField({ name: 'signupIp', title: 'Signup IP', type: 'string', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
});
