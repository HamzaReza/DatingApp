import { Borders } from "@/constants/Borders";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { RootState } from "@/redux/store";
import { hp, wp } from "@/utils";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";
import RnButton from "./RnButton";
import RnModal from "./RnModal";
import RnText from "./RnText";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentData?: any;
  isPreInitialized?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onSuccess,
  paymentData,
  isPreInitialized = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const { user } = useSelector((state: RootState) => state.user);

  const { confirmPayment } = useStripe();

  useEffect(() => {
    if (visible && isPreInitialized && paymentData) {
      // Use pre-initialized data
      setClientSecret(paymentData.clientSecret);
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
    setLoading(false);
    setClientSecret(null);
    setCardDetails(null);

    onClose();
  };

  const styles = createStyles(theme);

  return (
    <RnModal show={visible} backButton={handleClose} backDrop={handleClose}>
      <View style={styles.container}>
        <RnText style={styles.title}>Payment</RnText>
        <RnText style={styles.subtitle}>Book a Meetup</RnText>
        <RnText style={styles.description}>
          Pay $5.00 to book a meetup with your match. You&apos;ll get a full
          refund if the other person doesn&apos;t pay within 24 hours.
        </RnText>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].primary} />
            <RnText style={styles.loadingText}>Processing payment...</RnText>
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

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      padding: wp(4),
      backgroundColor: Colors[theme].background,
      borderRadius: Borders.radius2,
      margin: wp(4),
    },
    title: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      textAlign: "center",
      marginBottom: hp(1),
    },
    subtitle: {
      fontSize: FontSize.large,
      textAlign: "center",
      marginBottom: hp(1),
      color: Colors[theme].primary,
    },
    description: {
      fontSize: FontSize.medium,
      textAlign: "center",
      marginBottom: hp(1),
      color: Colors[theme].primary,
      lineHeight: hp(2),
    },
    loadingContainer: {
      alignItems: "center",
      paddingVertical: hp(10),
    },
    loadingText: {
      marginTop: hp(3),
      color: Colors[theme].placeholderText,
    },
    cardContainer: {
      marginBottom: hp(3),
    },
    card: {
      borderWidth: 1,
      borderColor: Colors[theme].primary,
      backgroundColor: Colors[theme].background,
    },
    cardField: {
      height: hp(6),
    },
    buttonContainer: {
      gap: hp(3),
    },
    payButton: {
      backgroundColor: Colors[theme].primary,
      width: wp(60),
      height: hp(5),
    },
    cancelButton: {
      backgroundColor: "gray",
      width: wp(60),
      height: hp(5),
    },
  });

export default PaymentModal;
