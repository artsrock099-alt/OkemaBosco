import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { bookingSchema } from '@/lib/validations';
import { generateReference } from '@/lib/utils';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const reference = generateReference('BK');

    const booking = await prisma.booking.create({
      data: {
        reference,
        type: parsed.data.type,
        status: 'NEW',
        eventDate: new Date(parsed.data.eventDate),
        alternativeDate: parsed.data.alternativeDate
          ? new Date(parsed.data.alternativeDate)
          : undefined,
        venue: parsed.data.venue,
        location: parsed.data.location,
        expectedAudience: parsed.data.expectedAudience,
        eventDescription: parsed.data.eventDescription,
        budget: parsed.data.budget ? String(parsed.data.budget) : undefined,
        customerName: parsed.data.customerName,
        organization: parsed.data.organization,
        customerEmail: parsed.data.customerEmail,
        customerPhone: parsed.data.customerPhone,
        additionalInfo: parsed.data.additionalInfo,
      },
    });

    await createAuditLog('CREATE', 'BOOKING', booking.id, undefined, {
      reference: booking.reference,
      type: booking.type,
      email: booking.customerEmail,
    });

    return NextResponse.json({
      success: true,
      reference,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  }
}
