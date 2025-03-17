import { NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to create a checkout session' },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      customer_email: session.user?.email || undefined,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 