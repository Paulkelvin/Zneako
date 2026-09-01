import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthorizedAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'A signup id is required' }, { status: 400 });
  }

  // Confirm the id actually belongs to a waitlistSignup before deleting —
  // sanityServerClient.delete() has no type guard of its own, so without this
  // check a bad/foreign id here could delete any document in the dataset
  // (e.g. singleton page content), not just waitlist signups.
  const doc = await sanityServerClient.fetch<{ _id: string } | null>(
    `*[_id == $id && _type == "waitlistSignup"][0]{ _id }`,
    { id }
  );
  if (!doc) {
    return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
  }

  try {
    await sanityServerClient.delete(id);
  } catch (err) {
    console.error('Failed to delete waitlist signup', err);
    return NextResponse.json({ error: 'Failed to delete signup' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
