// Stripe related types
export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface License {
  token: string;
  purchasedAt: string;
  isActive: boolean;
  productType: 'pdf_tools_premium';
}

export interface PaymentMetadata {
  product: string;
  userId?: string;
  email?: string;
}