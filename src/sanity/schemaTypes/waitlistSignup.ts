import { defineField, defineType } from 'sanity';

// Written by src/app/api/waitlist/route.ts, not edited here — this schema
// exists so admins can browse/search signups in Studio, not so it can be
// authored from scratch there.
export default defineType({
  name: 'waitlistSignup',
  title: 'Waitlist Signups',
  type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'ageRange', title: 'Child age range', type: 'string', readOnly: true }),
    defineField({ name: 'referralCode', title: 'Referral code', type: 'string', readOnly: true }),
    defineField({ name: 'referralCount', title: 'Referral count', type: 'number', readOnly: true }),
    defineField({ name: 'signupIp', title: 'Signup IP', type: 'string', readOnly: true }),
    defineField({
      name: 'referredBy',
      title: 'Referred by',
      type: 'reference',
      to: [{ type: 'waitlistSignup' }],
      readOnly: true,
    }),
    defineField({
      name: 'selectionTier',
      title: 'Selection tier',
      type: 'string',
      options: { list: ['early', 'referral'] },
      readOnly: true,
      description: 'Set by /api/admin/select-winners, not edited here.',
    }),
    defineField({ name: 'selectedAt', title: 'Selected at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'ageRange' },
  },
});
