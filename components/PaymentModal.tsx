import { RootState } from "@/redux/store";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../constants/Colors";
import { updatePaymentStatus } from "../firebase/stripe";
import { useColorScheme } from "../hooks/useColorScheme";
import RnButton from "./RnButton";
import RnModal from "./RnModal";
import RnText from "./RnText";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  matchId: string;
  userId: string;
  paymentData?: any;
  isPreInitialized?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onSuccess,
  matchId,
  userId,
  paymentData,
  isPreInitialized = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const { user } = useSelector((state: RootState) => state.user);

  const { confirmPayment, createPaymentMethod } = useStripe();

  useEffect(() => {
    if (visible) {
      if (isPreInitialized && paymentData) {
        // Use pre-initialized data
        setPaymentId(paymentData.paymentId);
        setClientSecret(paymentData.clientSecret);
      }
    }
  }, [visible, isPreInitialized, paymentData]);

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Error", "Please enter valid card details.");
      return;
    }

    if (!clientSecret) {
      Alert.alert("Error", "Payment not initialized. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // Skip payment method creation and go directly to payment confirmation

      // Try with different payment method type
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: user?.email || "user@example.com", // Fallback email
          },
        },
      });

      if (error) {
        console.error("Payment confirmation error:", error);

        // Handle specific network errors
        if (error.message?.includes("kCFErrorDomainCFNetwork error -1001")) {
          Alert.alert(
            "Network Timeout",
            "The payment request timed out. Please check your internet connection and try again."
          );
        } else {
          Alert.alert(
            "Payment Failed",
            error.message ||
              "There was an error processing your payment. Please try again."
          );
        }
        return;
      }

      if (paymentIntent) {
        console.log("Payment successful:", paymentIntent);

        // Update payment status to completed
        if (paymentId) {
          await updatePaymentStatus(paymentId, "completed");
        }

        Alert.alert(
          "Payment Successful!",
          "Your payment of $5.00 has been processed successfully. You will be notified when the other user completes their payment.",
          [
            {
              text: "OK",
              onPress: () => {
                onSuccess();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    // Reset state when closing
    setPaymentId(null);
    setClientSecret(null);
    setCardDetails(null);

    onClose();
  };

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  return (
    <RnModal show={visible} backDrop={handleClose}>
      <View style={styles.container}>
        <RnText style={styles.title}>Complete Payment</RnText>
        <RnText style={styles.subtitle}>Pay $5.00 to unlock this match</RnText>

        <RnText style={styles.description}>
          Both users must pay within 10 minutes to confirm the match. If the
          other user doesn&apos;t pay, you&apos;ll receive a full refund.
        </RnText>

        {loading && !clientSecret ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].primary} />
            <RnText style={styles.loadingText}>Initializing payment...</RnText>
          </View>
        ) : (
          <>
            <View style={styles.cardContainer}>
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={styles.card}
                style={styles.cardField}
                onCardChange={setCardDetails}
              />
            </View>

            <View style={styles.buttonContainer}>
              <RnButton
                title={loading ? "Processing..." : "Pay $5.00"}
                onPress={handlePayment}
                disabled={loading || !cardDetails?.complete}
                style={[styles.payButton]}
              />

              <RnButton
                title="Cancel"
                onPress={handleClose}
                disabled={loading}
                style={[styles.cancelButton]}
              />
            </View>
          </>
        )}
      </View>
    </RnModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: Colors.light.blackText,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    color: Colors.light.placeholderText,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: Colors.light.placeholderText,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.placeholderText,
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
  cardField: {
    width: "100%",
    height: 50,
  },
  buttonContainer: {
    gap: 12,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    borderColor: Colors.light.gray,
  },
});

export default PaymentModal;
