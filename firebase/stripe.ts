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

// Create a new payment intent for match messages
export const createMessagePaymentIntent = async (
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

// Create a new payment intent for event tickets
export const createEventTicketPaymentIntent = async (
  userId: string,
  eventId: string
): Promise<string> => {
  try {
    if (!userId || !eventId) {
      throw new Error("userId and eventId are required");
    }

    // Generate a unique payment ID without creating the document yet
    const paymentId = `event_ticket_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return paymentId;
  } catch (error) {
    console.error("Error creating event ticket payment intent:", error);
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

// Check if the other user (not current user) has paid for a match
export const checkOtherUserPaid = async (
  matchId: string,
  currentUserId: string
): Promise<boolean> => {
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

    // Check if the other user has paid by looking at their payment ID
    if (matchPayment.user1Id === currentUserId) {
      // Current user is user1, check if user2 has paid
      return !!matchPayment.user2PaymentId;
    } else if (matchPayment.user2Id === currentUserId) {
      // Current user is user2, check if user1 has paid
      return !!matchPayment.user1PaymentId;
    }

    return false;
  } catch (error) {
    console.error("Error checking if other user paid:", error);
    return false;
  }
};

// Real-time listener for checking if other user has paid
export const onOtherUserPaidChange = (
  matchId: string,
  currentUserId: string,
  callback: (otherUserPaid: boolean) => void
) => {
  const db = getFirestore();

  // Get the match payment record
  const matchPaymentQuery = query(
    collection(db, "matchPayments"),
    where("matchId", "==", matchId)
  );

  return onSnapshot(
    matchPaymentQuery,
    snapshot => {
      if (snapshot.empty) {
        callback(false);
        return;
      }

      const matchPayment = snapshot.docs[0].data() as MatchPayment;

      // Check if the other user has paid by looking at their payment ID
      if (matchPayment.user1Id === currentUserId) {
        // Current user is user1, check if user2 has paid
        callback(!!matchPayment.user2PaymentId);
      } else if (matchPayment.user2Id === currentUserId) {
        // Current user is user2, check if user1 has paid
        callback(!!matchPayment.user1PaymentId);
      } else {
        callback(false);
      }
    },
    error => {
      console.error("Error listening to other user payment status:", error);
      callback(false);
    }
  );
};
