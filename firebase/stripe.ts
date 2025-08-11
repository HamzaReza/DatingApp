import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "@react-native-firebase/firestore";
import { PAYMENT_STATUS, PaymentStatus } from "../constants/Stripe";

export interface PaymentIntent {
  id: string;
  userId: string;
  matchId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  refundedAt?: Timestamp;
  refundReason?: string;
}

export interface MatchPayment {
  id: string;
  matchId: string;
  user1Id: string;
  user2Id: string;
  user1PaymentId?: string;
  user2PaymentId?: string;
  status: "pending" | "completed" | "expired" | "refunded";
  createdAt: Timestamp;
  completedAt?: Timestamp;
  expiresAt: Timestamp;
}

// Create a new payment intent for a user
export const createPaymentIntent = async (
  userId: string,
  matchId: string
): Promise<string> => {
  try {
    if (!userId || !matchId) {
      throw new Error("userId and matchId are required");
    }

    const db = getFirestore();

    // Check if payment already exists (for successful payments)
    const existingPaymentQuery = query(
      collection(db, "payments"),
      where("userId", "==", userId),
      where("matchId", "==", matchId),
      where("status", "in", [PAYMENT_STATUS.PAID, PAYMENT_STATUS.COMPLETED])
    );

    const existingPaymentSnapshot = await getDocs(existingPaymentQuery);
    if (!existingPaymentSnapshot.empty) {
      throw new Error("Payment already exists for this match");
    }

    // Generate a unique payment ID without creating the document yet
    const paymentId = `payment_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return paymentId;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Get match payment status
export const getMatchPaymentStatus = (
  matchId: string,
  callback: (matchPayment: MatchPayment | null) => void
) => {
  try {
    const db = getFirestore();
    const matchPaymentQuery = query(
      collection(db, "matchPayments"),
      where("matchId", "==", matchId)
    );

    return onSnapshot(
      matchPaymentQuery,
      snapshot => {
        if (snapshot.empty) {
          callback(null);
          return;
        }

        const matchPayment = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as MatchPayment;

        callback(matchPayment);
      },
      error => {
        console.error("Error in match payment listener:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up match payment listener:", error);
    throw error;
  }
};

// Check if both users have completed their payments for a match
export const checkBothUsersPaid = async (matchId: string): Promise<boolean> => {
  try {
    const db = getFirestore();

    // Get the match payment record
    const matchPaymentQuery = query(
      collection(db, "matchPayments"),
      where("matchId", "==", matchId)
    );

    const matchPaymentSnapshot = await getDocs(matchPaymentQuery);

    if (matchPaymentSnapshot.empty) {
      return false;
    }

    const matchPayment = matchPaymentSnapshot.docs[0].data() as MatchPayment;

    // Simply check if the match payment status is "completed"
    const bothCompleted = matchPayment.status === "completed";

    return bothCompleted;
  } catch (error) {
    console.error("Error checking if both users paid:", error);
    return false;
  }
};
