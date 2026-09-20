import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { bookingSchema } from '@/lib/validations';
import { generateReference } from '@/lib/utils';
import { createAuditLog } from '@/lib/audit';
import { notify } from '@/lib/notifications';
import {
  sendBookingAdminNotification,
  sendBookingConfirmation,
} from '@/lib/email/notifications';
import { clientIp, rateLimit, tooManyRequests, userAgent } from '@/lib/rate-limit';

/**
 * Public booking enquiry endpoint.
 *
 * The booking is saved first and always wins: notifications and emails are
 * attempted afterwards and can fail without losing the enquiry. Repeats of the
 * same submission within a short window return the original reference instead
 * of creating a duplicate.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`booking:${ip}`, 5, 60 * 10);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  try {
    const body = await request.json();

    // Hidden field that only a bot fills in.
    if (typeof body?._honey === 'string' && body._honey.trim() !== '') {
      return NextResponse.json({ success: true, reference: generateReference('BK') });
    }

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

    const data = parsed.data;
    const eventDate = new Date(data.eventDate);

    // Duplicate submission protection: an identical enquiry from the same
    // person within the last two minutes is treated as the same request.
    const duplicate = await prisma.booking.findFirst({
      where: {
        customerEmail: data.customerEmail.toLowerCase(),
        type: data.type,
        eventDate,
        createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
      },
      select: { id: true, reference: true },
    });

    if (duplicate) {
      return NextResponse.json({
        success: true,
        reference: duplicate.reference,
        bookingId: duplicate.id,
        duplicate: true,
      });
    }

    const reference = generateReference('BK');

    const booking = await prisma.booking.create({
      data: {
        reference,
        type: data.type,
        status: 'NEW',
        eventDate,
        alternativeDate: data.alternativeDate
          ? new Date(data.alternativeDate)
          : undefined,
        venue: data.venue,
        location: data.location,
        expectedAudience: data.expectedAudience,
        eventDescription: data.eventDescription,
        budget: data.budget ? String(data.budget) : undefined,
        customerName: data.customerName,
        organization: data.organization,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        additionalInfo: data.additionalInfo,
      },
    });

    await createAuditLog(
      'BOOKING_CREATED',
      'BOOKING',
      booking.id,
      undefined,
      { reference: booking.reference, type: booking.type, email: booking.customerEmail },
      ip,
      userAgent(request)
    );

    // Dashboard notification plus the designed admin email.
    await notify({
      type: 'BOOKING',
      title: 'New booking request',
      message: `${booking.customerName} - ${booking.reference}`,
      entityType: 'Booking',
      entityId: booking.id,
      link: `/admin/bookings/${booking.id}`,
      sendEmailNotification: () => sendBookingAdminNotification(booking),
    });

    // Acknowledgement to the customer.
    await sendBookingConfirmation(booking).catch((error) =>
      console.error('Booking confirmation email failed:', error)
    );

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
