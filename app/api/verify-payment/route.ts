import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Generate a unique license token
    const licenseToken = crypto.randomBytes(32).toString('hex');

    // Create license object
    const license = {
      token: licenseToken,
      purchasedAt: new Date().toISOString(),
      isActive: true,
      productType: 'pdf_tools_premium',
      sessionId: session.id,
      email: session.customer_email || session.customer_details?.email || '',
    };

    // Here you would normally save to database
    // For now, we'll return the license for client-side storage
    
    return NextResponse.json({
      success: true,
      license: license,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}