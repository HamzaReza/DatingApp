import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { getMatchPaymentStatus, MatchPayment } from "../firebase/stripe";
import { useColorScheme } from "../hooks/useColorScheme";
import RnButton from "./RnButton";
import RnText from "./RnText";

interface PaymentStatusProps {
  matchId: string;
  userId: string;
  onPaymentRequired: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  matchId,
  userId,
  onPaymentRequired,
}) => {
  const [matchPayment, setMatchPayment] = useState<MatchPayment | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const unsubscribe = getMatchPaymentStatus(matchId, payment => {
      setMatchPayment(payment);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <RnText style={styles.loadingText}>Loading payment status...</RnText>
      </View>
    );
  }

  if (!matchPayment) {
    return (
      <View style={styles.container}>
        <RnText style={styles.title}>Payment Required</RnText>
        <RnText style={styles.description}>
          Both users must pay $5.00 to unlock this match
        </RnText>
        <RnButton
          title="Pay $5.00"
          onPress={onPaymentRequired}
          style={[styles.payButton]}
        />
      </View>
    );
  }

  const isUser1 = matchPayment.user1Id === userId;
  const userPaymentId = isUser1
    ? matchPayment.user1PaymentId
    : matchPayment.user2PaymentId;
  const otherUserPaymentId = isUser1
    ? matchPayment.user2PaymentId
    : matchPayment.user1PaymentId;

  const hasUserPaid = !!userPaymentId;
  const hasOtherUserPaid = !!otherUserPaymentId;

  const getStatusText = () => {
    switch (matchPayment.status) {
      case "completed":
        return "Match unlocked! Both users have paid.";
      case "expired":
        return "Payment window expired. You will receive a refund.";
      case "refunded":
        return "Payment refunded.";
      default:
        if (hasUserPaid && !hasOtherUserPaid) {
          return "Waiting for other user to pay...";
        } else if (!hasUserPaid && hasOtherUserPaid) {
          return "Other user has paid. Please complete your payment.";
        } else if (!hasUserPaid && !hasOtherUserPaid) {
          return "No payments made yet.";
        }
        return "Payment pending...";
    }
  };

  const getStatusColor = () => {
    switch (matchPayment.status) {
      case "completed":
        return Colors[theme].greenText;
      case "expired":
      case "refunded":
        return Colors[theme].redText;
      default:
        return Colors[theme].placeholderText;
    }
  };

  return (
    <View style={styles.container}>
      <RnText style={styles.title}>Payment Status</RnText>
      <RnText style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText()}
      </RnText>

      {!hasUserPaid && matchPayment.status === "pending" && (
        <RnButton
          title="Pay $5.00"
          onPress={onPaymentRequired}
          style={[styles.payButton]}
        />
      )}

      {hasUserPaid &&
        !hasOtherUserPaid &&
        matchPayment.status === "pending" && (
          <RnText style={styles.waitingText}>
            You have paid. Waiting for the other user to complete their payment.
          </RnText>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.light.blackText,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.light.placeholderText,
    lineHeight: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  waitingText: {
    fontSize: 14,
    color: Colors.light.placeholderText,
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.placeholderText,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: Colors.light.primary,
  },
});

export default PaymentStatus;
