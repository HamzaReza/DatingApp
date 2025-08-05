import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "@react-native-firebase/firestore";
import {
  PAYMENT_STATUS,
  PaymentStatus,
  STRIPE_CONFIG,
} from "../constants/Stripe";

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
    console.log("Creating payment intent for:", { userId, matchId });

    if (!userId || !matchId) {
      throw new Error("userId and matchId are required");
    }

    const db = getFirestore();

    // Check if payment already exists
    const existingPaymentQuery = query(
      collection(db, "payments"),
      where("userId", "==", userId),
      where("matchId", "==", matchId),
      where("status", "in", [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.COMPLETED])
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

// Create or update match payment record
const createOrUpdateMatchPayment = async (
  matchId: string,
  userId: string,
  paymentId: string
) => {
  const db = getFirestore();

  // Get the match to find both users
  const matchDoc = await getDoc(doc(db, "matches", matchId));
  if (!matchDoc.exists()) {
    console.error("Match not found for matchId:", matchId);
    throw new Error(`Match not found for matchId: ${matchId}`);
  }

  const matchData = matchDoc.data();
  if (!matchData) {
    throw new Error("Match data not found");
  }

  console.log("Match data:", matchData);

  const user1Id = matchData.users[0];
  const user2Id = matchData.users[1];

  if (!user1Id || !user2Id) {
    throw new Error("Match data is missing user1Id or user2Id");
  }

  // Check if match payment record exists
  const matchPaymentQuery = query(
    collection(db, "matchPayments"),
    where("matchId", "==", matchId)
  );

  const matchPaymentSnapshot = await getDocs(matchPaymentQuery);

  if (matchPaymentSnapshot.empty) {
    // Create new match payment record
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + STRIPE_CONFIG.REFUND_WINDOW_HOURS
    );

    const matchPaymentData: Omit<MatchPayment, "id"> = {
      matchId,
      user1Id,
      user2Id,
      status: "pending",
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
    };

    if (userId === user1Id) {
      matchPaymentData.user1PaymentId = paymentId;
    } else if (userId === user2Id) {
      matchPaymentData.user2PaymentId = paymentId;
    }

    await addDoc(collection(db, "matchPayments"), matchPaymentData);
  } else {
    // Update existing match payment record
    const matchPaymentDoc = matchPaymentSnapshot.docs[0];
    const updateData: any = {};

    if (userId === user1Id) {
      updateData.user1PaymentId = paymentId;
    } else if (userId === user2Id) {
      updateData.user2PaymentId = paymentId;
    }

    await updateDoc(matchPaymentDoc.ref, updateData);
  }
};

// Update payment status
export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus,
  stripePaymentIntentId?: string
) => {
  try {
    const db = getFirestore();
    const paymentRef = doc(db, "payments", paymentId);

    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }

    if (status === PAYMENT_STATUS.REFUNDED) {
      updateData.refundedAt = Timestamp.now();
    }

    await updateDoc(paymentRef, updateData);

    // Check if both users have paid
    if (status === PAYMENT_STATUS.COMPLETED) {
      await checkAndUpdateMatchPaymentStatus(paymentId);
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Check if both users have paid and update match payment status
const checkAndUpdateMatchPaymentStatus = async (paymentId: string) => {
  const db = getFirestore();

  // Get the payment to find the match
  const paymentDoc = await getDoc(doc(db, "payments", paymentId));
  if (!paymentDoc.exists()) return;

  const paymentData = paymentDoc.data() as PaymentIntent;
  const matchId = paymentData.matchId;

  // Get match payment record
  const matchPaymentQuery = query(
    collection(db, "matchPayments"),
    where("matchId", "==", matchId)
  );

  const matchPaymentSnapshot = await getDocs(matchPaymentQuery);
  if (matchPaymentSnapshot.empty) return;

  const matchPaymentDoc = matchPaymentSnapshot.docs[0];
  const matchPaymentData = matchPaymentDoc.data() as MatchPayment;

  // Check if both users have completed payments
  const user1Payment = matchPaymentData.user1PaymentId
    ? await getDoc(doc(db, "payments", matchPaymentData.user1PaymentId))
    : null;

  const user2Payment = matchPaymentData.user2PaymentId
    ? await getDoc(doc(db, "payments", matchPaymentData.user2PaymentId))
    : null;

  const user1Completed =
    user1Payment?.exists() &&
    user1Payment.data()?.status === PAYMENT_STATUS.COMPLETED;

  const user2Completed =
    user2Payment?.exists() &&
    user2Payment.data()?.status === PAYMENT_STATUS.COMPLETED;

  if (user1Completed && user2Completed) {
    // Both users have paid - mark match payment as completed
    await updateDoc(matchPaymentDoc.ref, {
      status: "completed",
      completedAt: Timestamp.now(),
    });
  }
};

// Get payment by ID
export const getPayment = async (
  paymentId: string
): Promise<PaymentIntent | null> => {
  try {
    const db = getFirestore();
    const paymentDoc = await getDoc(doc(db, "payments", paymentId));

    if (!paymentDoc.exists()) {
      return null;
    }

    return {
      id: paymentDoc.id,
      ...paymentDoc.data(),
    } as PaymentIntent;
  } catch (error) {
    console.error("Error getting payment:", error);
    throw error;
  }
};

// Get payments for a user
export const getUserPayments = (
  userId: string,
  callback: (payments: PaymentIntent[]) => void
) => {
  try {
    const db = getFirestore();
    const paymentsQuery = query(
      collection(db, "payments"),
      where("userId", "==", userId)
    );

    return onSnapshot(
      paymentsQuery,
      snapshot => {
        const payments = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as PaymentIntent[];

        callback(payments);
      },
      error => {
        console.error("Error in payments listener:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up payments listener:", error);
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

// Process refund for expired payments
export const processRefund = async (paymentId: string, reason: string) => {
  try {
    const db = getFirestore();
    const paymentRef = doc(db, "payments", paymentId);

    await updateDoc(paymentRef, {
      status: PAYMENT_STATUS.REFUNDED,
      refundedAt: Timestamp.now(),
      refundReason: reason,
    });

    // Update match payment status if needed
    const paymentDoc = await getDoc(paymentRef);
    if (paymentDoc.exists()) {
      const paymentData = paymentDoc.data() as PaymentIntent;
      await checkAndUpdateMatchPaymentStatus(paymentId);
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
};

// Check for expired payments and process refunds
export const checkExpiredPayments = async () => {
  try {
    const db = getFirestore();
    const now = Timestamp.now();

    const expiredPaymentsQuery = query(
      collection(db, "payments"),
      where("status", "==", PAYMENT_STATUS.PENDING),
      where("expiresAt", "<", now)
    );

    const expiredPaymentsSnapshot = await getDocs(expiredPaymentsQuery);

    const batch = writeBatch(db);

    expiredPaymentsSnapshot.docs.forEach((doc: any) => {
      const paymentData = doc.data() as PaymentIntent;

      // Update payment status to expired
      batch.update(doc.ref, {
        status: PAYMENT_STATUS.EXPIRED,
        updatedAt: now,
      });

      // Process refund
      batch.update(doc.ref, {
        status: PAYMENT_STATUS.REFUNDED,
        refundedAt: now,
        refundReason: "Payment expired - 10 minute window passed",
      });
    });

    await batch.commit();

    return expiredPaymentsSnapshot.size;
  } catch (error) {
    console.error("Error checking expired payments:", error);
    throw error;
  }
};
