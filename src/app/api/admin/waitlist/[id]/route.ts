import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return Boolean(process.env.ADMIN_SECRET) && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'A signup id is required' }, { status: 400 });
  }

  try {
    await sanityServerClient.delete(id);
  } catch (err) {
    console.error('Failed to delete waitlist signup', err);
    return NextResponse.json({ error: 'Failed to delete signup' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
