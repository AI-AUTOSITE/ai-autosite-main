import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Search for payments by email
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items'],
    });

    // Filter for this customer's successful PDF Tools purchases
    const validPurchase = sessions.data.find(
      session => 
        session.customer_email === email &&
        session.payment_status === 'paid' &&
        session.metadata?.product === 'pdf_tools_premium'
    );

    if (!validPurchase) {
      return NextResponse.json(
        { error: 'No valid purchase found for this email' },
        { status: 404 }
      );
    }

    // Generate recovery license
    const crypto = require('crypto');
    const licenseToken = crypto.randomBytes(32).toString('hex');

    const license = {
      token: licenseToken,
      purchasedAt: new Date(validPurchase.created * 1000).toISOString(),
      isActive: true,
      productType: 'pdf_tools_premium',
      email: email,
      sessionId: validPurchase.id,
      recovered: true,
    };

    return NextResponse.json({
      success: true,
      license: license,
      message: 'License recovered successfully',
    });
  } catch (error) {
    console.error('License recovery error:', error);
    return NextResponse.json(
      { error: 'Failed to recover license' },
      { status: 500 }
    );
  }
}