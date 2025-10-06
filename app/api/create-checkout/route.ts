import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    // Get request data
    const body = await request.json()
    const { email } = body

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PDF Tools Premium - 6 Slots',
              description:
                'Unlock 3 additional tool slots (6 total) for advanced PDF editing. One-time payment, lifetime access.',
              images: ['https://ai-autosite.com/pdf-tools-icon.png'], // Update with actual icon
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/tools/pdf-tools/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/tools/pdf-tools`,
      metadata: {
        product: 'pdf_tools_premium',
        email: email || '',
      },
      // Optional: collect email if not provided
      customer_email: email || undefined,
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
