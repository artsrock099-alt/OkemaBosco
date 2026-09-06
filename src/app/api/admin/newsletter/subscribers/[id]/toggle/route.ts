import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

type Props = { params: { id: string } };

export async function POST(_request: Request, { params }: Props) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: params.id },
    });
    if (!subscriber) {
      return NextResponse.json({ message: 'Subscriber not found' }, { status: 404 });
    }

    const next = await prisma.newsletterSubscriber.update({
      where: { id: params.id },
      data: {
        isActive: !subscriber.isActive,
        unsubscribedAt: subscriber.isActive ? new Date() : null,
      },
    });

    await createAuditLog('UPDATE', 'NEWSLETTER_SUBSCRIBER', next.id, guard.session.user.id, {
      isActive: next.isActive,
    });

    return NextResponse.json({ success: true, isActive: next.isActive });
  } catch (error) {
    return handleApiError(error, 'Failed to toggle subscriber');
  }
}
