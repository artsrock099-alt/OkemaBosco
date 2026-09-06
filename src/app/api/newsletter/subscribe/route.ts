import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { newsletterSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: 'Already subscribed. Thank you!',
        });
      }
      await prisma.newsletterSubscriber.update({
        where: { email: parsed.data.email },
        data: {
          isActive: true,
          unsubscribedAt: null,
          firstName: parsed.data.firstName ?? existing.firstName,
          lastName: parsed.data.lastName ?? existing.lastName,
        },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: parsed.data,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully.',
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { message: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
