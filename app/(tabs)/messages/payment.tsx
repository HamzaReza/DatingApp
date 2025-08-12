import createStyles from "@/app/eventScreens/styles/paymentScreen.styles";
import PaymentModal from "@/components/PaymentModal";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { createMessagePaymentIntent } from "@/firebase/stripe";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";
import { hp } from "@/utils";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { getFunctions } from "@react-native-firebase/functions";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const paymentMethods = [
  {
    id: "apple",
    name: "Apple Pay",
    icon: <AntDesign name="apple1" size={24} color="black" />,
    selected: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <FontAwesome5 name="paypal" size={24} color="#003087" />,
    selected: false,
  },
  {
    id: "google",
    name: "Google Pay",
    icon: <FontAwesome5 name="google-pay" size={24} color="#5F6368" />,
    selected: false,
  },
  {
    id: "debit/credit",
    name: "Debit/Credit Card",
    icon: <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />,
    selected: false,
  },
];

const MessagePaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("apple");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);

  const { matchId } = useLocalSearchParams();

  // New checkout function that handles Stripe payments
  const onCheckoutPress = async () => {
    console.log("Selected payment method:", selectedMethod);

    if (selectedMethod === "debit/credit") {
      try {
        setIsInitializing(true);

        // Initialize payment before showing modal
        const paymentId = await createMessagePaymentIntent(
          user?.uid || "",
          matchId as string
        );

        // Call Firebase function to create payment intent
        const createMessagePaymentIntentFunction = getFunctions().httpsCallable(
          "createMessagePaymentIntent"
        );
        const result = await createMessagePaymentIntentFunction({
          paymentId,
          amount: 500, // $5.00 in cents
          matchId: matchId as string,
          userId: user?.uid || "",
        });

        const { clientSecret } = result.data as { clientSecret: string };

        // Set payment data and show modal
        setPaymentData({
          paymentId,
          clientSecret,
        });

        setIsPaymentModalVisible(true);
      } catch (error) {
        console.error("Error initializing payment:", error);
        Alert.alert("Error", "Failed to initialize payment. Please try again.");
      } finally {
        setIsInitializing(false);
      }
    } else {
      console.log(`User selected ${selectedMethod} payment method`);
    }
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
    router.back();
  };

  const handlePaymentClose = () => {
    setIsPaymentModalVisible(false);
    setPaymentData(null);
  };

  return (
    <Container>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="arrow-back"
          iconSize={22}
          backgroundColour={Colors[theme].background}
          iconColor={Colors[theme].primary}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerTitle}>Unlock Match</RnText>
        <RoundButton noShadow />
      </View>

      <RnText
        style={[styles.subtitle, { textAlign: "center", marginTop: hp(1) }]}
      >
        Choose your preferred payment method to unlock this match
      </RnText>

      {/* Payment Options */}
      {paymentMethods.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.methodButton}
          onPress={() => setSelectedMethod(item.id)}
          activeOpacity={1}
        >
          <View style={styles.radioRow}>
            <View
              style={
                selectedMethod === item.id
                  ? styles.selectedRadio
                  : styles.unselectedRadio
              }
            >
              {selectedMethod === item.id && <View style={styles.radioDot} />}
            </View>
            {item.icon}
            <RnText style={styles.methodName}>{item.name}</RnText>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.paymentSection}>
        <RnText style={styles.subtitle}>Payment Details</RnText>
        <View style={styles.paymentRow}>
          <RnText style={styles.label}>Match Unlock Fee</RnText>
          <RnText style={styles.value}>$5.00</RnText>
        </View>
        <View style={styles.paymentRow}>
          <RnText style={styles.label}>Total</RnText>
          <RnText style={styles.value}>$5.00</RnText>
        </View>
      </View>

      <RnButton
        title="Checkout"
        style={[styles.checkoutBtn]}
        onPress={onCheckoutPress}
        loading={isInitializing}
      />

      {/* PaymentModal for Stripe payments */}
      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
        paymentData={paymentData}
        isPreInitialized={true}
      />
    </Container>
  );
};

export default MessagePaymentScreen;
