import { Borders } from "@/constants/Borders";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";
import RnButton from "./RnButton";
import RnModal from "./RnModal";
import RnText from "./RnText";
import showToaster from "./RnToast";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentData?: any;
  eventId?: string;
  totalPrice?: number;
  isPreInitialized?: boolean;
  paymentMethod?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onSuccess,
  paymentData,
  eventId,
  totalPrice,
  isPreInitialized = false,
  paymentMethod = "card",
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const [loading, setLoading] = useState(false);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (visible && isPreInitialized && paymentData) {
      // Use pre-initialized data

      // Initialize PaymentSheet
      const initializePaymentSheet = async () => {
        try {
          console.log("🚀 Starting PaymentSheet initialization...");

          // Only card payments are supported

          const { error } = await initPaymentSheet({
            paymentIntentClientSecret: paymentData.clientSecret,
            merchantDisplayName: "Dating App",
            style: "automatic", // or 'alwaysLight' based on your theme
            allowsDelayedPaymentMethods: true,
          });

          if (error) {
            showToaster({
              message: "Failed to initialize payment. Please try again.",
              type: "error",
            });
          } else {
            setPaymentSheetReady(true);
          }
        } catch (err) {
          console.log(
            "🚀 ~ PaymentModal.tsx:67 ~ initializePaymentSheet ~ err:",
            err
          );
          showToaster({
            message: "Failed to initialize payment. Please try again.",
            type: "error",
          });
        }
      };

      initializePaymentSheet();
    }
  }, [visible, isPreInitialized, paymentData, initPaymentSheet]);

  const handlePayment = async () => {
    if (!paymentSheetReady) {
      showToaster({
        message: "Payment not ready. Please wait a moment and try again.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      // Present PaymentSheet
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === "Canceled") {
          return;
        }

        showToaster({
          message:
            error.message ||
            "There was an error processing your payment. Please try again.",
          type: "error",
        });
        return;
      }

      onSuccess();
      onClose();

      showToaster({
        message: eventId
          ? `Your payment of $${totalPrice} has been processed successfully.`
          : `Your payment of $5.00 has been processed successfully. You will be notified when the other user completes their payment.`,
        type: "success",
      });
    } catch (error) {
      showToaster({
        message:
          "There was an error processing your payment. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    setPaymentSheetReady(false);

    onClose();
  };

  const styles = createStyles(theme);

  return (
    <RnModal show={visible} backButton={handleClose} backDrop={handleClose}>
      <View style={styles.container}>
        <RnText style={styles.title}>
          {eventId ? "Book a seat" : "Book a meetup"}
        </RnText>
        <RnText style={styles.description}>
          {eventId
            ? `Pay $${totalPrice} to book a ticket for the event.`
            : `Pay $5.00 to book a meetup with your match. You'll get a full refund if the other person doesn't pay within 24 hours.`}
        </RnText>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].primary} />
            <RnText style={styles.loadingText}>Processing payment...</RnText>
          </View>
        ) : (
          <>
            <RnText style={styles.cardInfo}>
              Payment will be processed securely through Stripe
            </RnText>

            <View style={styles.buttonContainer}>
              <RnButton
                title={loading ? "Processing..." : "Pay"}
                onPress={handlePayment}
                disabled={loading || !paymentSheetReady}
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
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      textAlign: "center",
      marginBottom: hp(1),
    },
    description: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.semiBold,
      textAlign: "center",
      marginBottom: hp(1),
      color: Colors[theme].primary,
    },
    loadingContainer: {
      alignItems: "center",
      paddingVertical: hp(10),
    },
    loadingText: {
      marginTop: hp(3),
      color: Colors[theme].placeholderText,
    },
    cardInfo: {
      fontSize: FontSize.small,
      textAlign: "center",
      color: Colors[theme].primary,
      marginBottom: hp(2),
    },
    buttonContainer: {
      gap: hp(1),
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
