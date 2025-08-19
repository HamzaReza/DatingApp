import * as admin from "firebase-admin";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-07-30.basil",
// });

// Stripe webhook handler
export const stripeWebhook = onRequest(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-07-30.basil",
  });

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      endpointSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Handle successful payment
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    // Extract payment details from metadata
    const { paymentId, userId, matchId, eventId } = paymentIntent.metadata;

    if (!paymentId || !userId) {
      console.error("Missing payment metadata:", paymentIntent.metadata);
      return;
    }

    // Get the amount from the payment intent
    const amount = paymentIntent.amount;
    const currency = paymentIntent.currency;

    // Determine if this is a match payment or event ticket payment
    if (matchId) {
      // Handle match payment
      await handleMatchPaymentSuccess(
        paymentIntent,
        paymentId,
        userId,
        matchId,
        amount,
        currency
      );
    } else if (eventId) {
      // Handle event ticket payment
      await handleEventTicketPaymentSuccess(
        paymentIntent,
        paymentId,
        userId,
        eventId,
        amount,
        currency
      );
    } else {
      console.error("Neither matchId nor eventId found in payment metadata");
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}

// Handle match payment success
async function handleMatchPaymentSuccess(
  paymentIntent: Stripe.PaymentIntent,
  paymentId: string,
  userId: string,
  matchId: string,
  amount: number,
  currency: string
) {
  // Create payment document in Firestore only after successful payment
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

  const paymentData = {
    userId: userId,
    matchId: matchId,
    amount: amount,
    currency: currency,
    status: "paid", // Directly set to paid since payment succeeded
    stripePaymentIntentId: paymentIntent.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: expiresAt,
  };

  // Create the payment document
  await db.collection("payments").doc(paymentId).set(paymentData);

  // Create or update match payment record
  await createOrUpdateMatchPaymentInFunction(matchId, userId, paymentId);

  // Check if both users have paid
  await checkAndUpdateMatchPaymentStatus(matchId);

  console.log("Match payment document created successfully:", paymentId);
}

// Handle event ticket payment success
async function handleEventTicketPaymentSuccess(
  paymentIntent: Stripe.PaymentIntent,
  paymentId: string,
  userId: string,
  eventId: string,
  amount: number,
  currency: string
) {
  const { ticketType, quantity } = paymentIntent.metadata;

  // Append this purchase to the user's event tickets document as an array item
  const userTicketsRef = db.collection("eventTickets").doc(userId);

  const ticketItem = {
    paymentId: paymentId,
    eventId: eventId,
    amount: amount,
    currency: currency,
    status: "completed", // Event tickets are completed immediately
    stripePaymentIntentId: paymentIntent.id,
    ticketType: ticketType || "normal",
    quantity: parseInt(quantity) || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await userTicketsRef.set(
    {
      purchases: admin.firestore.FieldValue.arrayUnion(ticketItem),
    },
    { merge: true }
  );

  console.log(
    "Event ticket purchase appended to user document:",
    userId,
    paymentId
  );
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const paymentsRef = db.collection("payments");
    const query = paymentsRef.where(
      "stripePaymentIntentId",
      "==",
      paymentIntent.id
    );
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error(
        "No payment record found for payment intent:",
        paymentIntent.id
      );
      return;
    }

    const paymentDoc = snapshot.docs[0];

    // Update payment status to failed
    await paymentDoc.ref.update({
      status: "failed",
      updatedAt: new Date(),
    });

    console.log("Payment failed:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}

// Handle charge refunded
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const paymentsRef = db.collection("payments");
    const query = paymentsRef.where(
      "stripePaymentIntentId",
      "==",
      charge.payment_intent
    );
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.error("No payment record found for charge:", charge.id);
      return;
    }

    const paymentDoc = snapshot.docs[0];

    // Update payment status to refunded
    await paymentDoc.ref.update({
      status: "refunded",
      refundedAt: new Date(),
      refundReason: "Refunded via Stripe",
    });

    console.log("Payment refunded:", charge.id);
  } catch (error) {
    console.error("Error handling charge refund:", error);
    throw error;
  }
}

// Check if both users have paid and update match payment status
async function checkAndUpdateMatchPaymentStatus(matchId: string) {
  try {
    const matchPaymentsRef = db.collection("matchPayments");
    const query = matchPaymentsRef.where("matchId", "==", matchId);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return;
    }

    const matchPaymentDoc = snapshot.docs[0];
    const matchPaymentData = matchPaymentDoc.data();

    // Check if both users have completed payments
    const user1Payment = matchPaymentData.user1PaymentId
      ? await db
          .collection("payments")
          .doc(matchPaymentData.user1PaymentId)
          .get()
      : null;

    const user2Payment = matchPaymentData.user2PaymentId
      ? await db
          .collection("payments")
          .doc(matchPaymentData.user2PaymentId)
          .get()
      : null;

    const user1Paid =
      user1Payment?.exists && user1Payment.data()?.status === "paid";

    const user2Paid =
      user2Payment?.exists && user2Payment.data()?.status === "paid";

    if (user1Paid && user2Paid) {
      // Both users have paid - mark individual payments as completed
      if (user1Payment?.exists) {
        await user1Payment.ref.update({
          status: "completed",
          completedAt: new Date(),
        });
      }

      if (user2Payment?.exists) {
        await user2Payment.ref.update({
          status: "completed",
          completedAt: new Date(),
        });
      }

      // Mark match payment as completed
      await matchPaymentDoc.ref.update({
        status: "completed",
        completedAt: new Date(),
      });

      console.log("Match payment completed for match:", matchId);
    }
  } catch (error) {
    console.error("Error checking match payment status:", error);
    throw error;
  }
}

// Helper function to create or update match payment record
async function createOrUpdateMatchPaymentInFunction(
  matchId: string,
  userId: string,
  paymentId: string
) {
  try {
    // Get the match to find both users
    const matchDoc = await db.collection("matches").doc(matchId).get();
    if (!matchDoc.exists) {
      console.log("no match exist");
      throw new Error(`Match not found for matchId: ${matchId}`);
    }

    const matchData = matchDoc.data();
    if (!matchData) {
      throw new Error("Match data not found");
    }

    const user1Id = matchData.users[0];
    const user2Id = matchData.users[1];

    if (!user1Id || !user2Id) {
      throw new Error("Match data is missing user1Id or user2Id");
    }

    // Check if match payment record exists
    const matchPaymentQuery = db
      .collection("matchPayments")
      .where("matchId", "==", matchId);

    const matchPaymentSnapshot = await matchPaymentQuery.get();

    if (matchPaymentSnapshot.empty) {
      // Create new match payment record
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      const matchPaymentData = {
        matchId,
        user1Id,
        user2Id,
        user1PaymentId: userId === user1Id ? paymentId : null,
        user2PaymentId: userId === user2Id ? paymentId : null,
        status: "pending",
        createdAt: new Date(),
        expiresAt: expiresAt,
      };

      await db.collection("matchPayments").add(matchPaymentData);
    } else {
      // Update existing match payment record
      const matchPaymentDoc = matchPaymentSnapshot.docs[0];
      const updateData: any = {};

      if (userId === user1Id) {
        updateData.user1PaymentId = paymentId;
      } else if (userId === user2Id) {
        updateData.user2PaymentId = paymentId;
      }

      await matchPaymentDoc.ref.update(updateData);
    }
  } catch (error) {
    console.error("Error creating/updating match payment:", error);
    throw error;
  }
}

// Scheduled function to check for expired payments and process refunds
export const checkExpiredPayments = onSchedule("every 6 hours", async event => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-07-30.basil",
  });

  try {
    const now = new Date();

    const paymentsRef = db.collection("payments");
    const query = paymentsRef
      .where("status", "==", "paid")
      .where("expiresAt", "<", now);

    const snapshot = await query.get();

    let refundCount = 0;

    for (const doc of snapshot.docs) {
      const paymentData = doc.data();

      try {
        // Process refund in Stripe
        if (paymentData.stripePaymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentData.stripePaymentIntentId
          );

          if (paymentIntent.latest_charge) {
            await stripe.refunds.create({
              charge: paymentIntent.latest_charge as string,
              reason: "requested_by_customer",
            });
          }
        }

        // Update payment status
        await doc.ref.update({
          status: "refunded",
          refundedAt: new Date(),
          refundReason: "Payment expired - 24 hour payment window passed",
        });

        refundCount++;
        console.log("Refunded expired payment:", doc.id);
      } catch (error) {
        console.error("Error processing refund for payment:", doc.id, error);
      }
    }

    console.log(`Processed ${refundCount} expired payments`);
  } catch (error) {
    console.error("Error in checkExpiredPayments:", error);
    throw error;
  }
});
// Function to create payment intent for match messages
export const createMessagePaymentIntent = onCall(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (data: any, context: any) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-07-30.basil",
    });

    try {
      // Get user ID from context or data
      const userId = context?.auth?.uid || data.data?.userId || data.userId;

      // Check if we have a valid user ID
      if (!userId) {
        throw new HttpsError("unauthenticated", "User ID is required");
      }

      const { paymentId, amount, matchId } = data.data || data;

      if (!paymentId || !amount || !matchId) {
        throw new HttpsError("invalid-argument", "Missing required parameters");
      }

      // Check if user has already paid for this match
      const existingPaymentQuery = db
        .collection("payments")
        .where("userId", "==", userId)
        .where("matchId", "==", matchId)
        .where("status", "in", ["paid", "completed"]);

      const existingPaymentSnapshot = await existingPaymentQuery.get();
      if (!existingPaymentSnapshot.empty) {
        throw new HttpsError(
          "already-exists",
          "Payment already exists for this match"
        );
      }

      // Create payment intent in Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        metadata: {
          paymentId: paymentId,
          userId: userId,
          matchId: matchId,
        },
      });

      // Return only the client secret - don't create Firestore document yet
      const result = {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
      return result;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new HttpsError("internal", "Failed to create payment intent");
    }
  }
);

// Function to create payment intent for event tickets
export const createEventTicketPaymentIntent = onCall(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (data: any, context: any) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-07-30.basil",
    });

    try {
      // Get user ID from context or data
      const userId = context?.auth?.uid || data.data?.userId || data.userId;

      // Check if we have a valid user ID
      if (!userId) {
        throw new HttpsError("unauthenticated", "User ID is required");
      }

      const { paymentId, amount, eventId, ticketType, quantity } =
        data.data || data;

      if (!paymentId || !amount || !eventId) {
        throw new HttpsError("invalid-argument", "Missing required parameters");
      }

      // Allow multiple ticket purchases for the same event
      // No duplicate check needed - users can buy multiple tickets

      // Create payment intent in Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        metadata: {
          paymentId: paymentId,
          userId: userId,
          eventId: eventId,
          ticketType: ticketType || "normal",
          quantity: quantity || "1",
        },
      });

      // Return only the client secret - don't create Firestore document yet
      const result = {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
      return result;
    } catch (error) {
      console.error("Error creating event ticket payment intent:", error);
      throw new HttpsError("internal", "Failed to create payment intent");
    }
  }
);
