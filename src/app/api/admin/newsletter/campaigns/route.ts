import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, handleApiError } from '@/lib/admin-api';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const body = await request.json();
    const { subject, previewText, content, status, scheduledAt } = body;

    if (!subject || !content) {
      return NextResponse.json({ message: 'Subject and content are required' }, { status: 400 });
    }

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject,
        previewText: previewText || undefined,
        content,
        status: status || 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
    });

    await createAuditLog('CREATE', 'NEWSLETTER_CAMPAIGN', campaign.id, guard.session.user.id, {
      subject: campaign.subject,
    });

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (error) {
    return handleApiError(error, 'Failed to create campaign');
  }
}
