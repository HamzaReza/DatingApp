export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  PUBLISHABLE_KEY: process.env.EXPO_STRIPE_PUBLISHABLE_KEY,

  // Payment settings
  PAYMENT_AMOUNT: 500, // $5.00 in cents
  PAYMENT_CURRENCY: "usd",

  // Refund settings
  REFUND_WINDOW_HOURS: 0.167, // 10 minutes for testing (10/60 = 0.167 hours)

  // Webhook events
  WEBHOOK_EVENTS: {
    PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded",
    PAYMENT_INTENT_FAILED: "payment_intent.payment_failed",
    CHARGE_REFUNDED: "charge.refunded",
    CHARGE_DISPUTE_CREATED: "charge.dispute.created",
  },
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  EXPIRED: "expired",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
