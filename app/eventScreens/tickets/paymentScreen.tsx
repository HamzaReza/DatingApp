import createStyles from "@/app/eventScreens/styles/paymentScreen.styles";
import PaymentModal from "@/components/PaymentModal";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnBottomSheetInput from "@/components/RnBottomSheetInput";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { PaymentService } from "@/firebase/paymentService";
import { addOrUpdateTicketSale } from "@/firebase/ticket";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";
import { hp, wp } from "@/utils";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const paymentMethods = [
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: <AntDesign name="apple1" size={24} color="black" />,
    selected: true,
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: <FontAwesome5 name="google-pay" size={24} color="#5F6368" />,
    selected: false,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <FontAwesome5 name="paypal" size={24} color="#003087" />,
    selected: false,
  },
  {
    id: "card",
    name: "Debit/Credit Card",
    icon: <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />,
    selected: false,
  },
];

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("apple_pay");
  // const [voucher, setVoucher] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);

  const { eventId, normalTicketPurchased, vipTicketPurchased, currentPrice } =
    useLocalSearchParams();

  // Validation schema for payment form
  const paymentValidationSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .matches(
        /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
        "Card number must be 16 digits with spaces"
      )
      .required("Card number is required"),
    expiryDate: Yup.string()
      .matches(
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
        "Expiry date must be in MM/YY format"
      )
      .required("Expiry date is required"),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
      .required("CVV is required"),
  });

  const initialValues = {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  };

  const handlePaymentSubmit = (values: typeof initialValues) => {
    console.log("Payment form submitted:", values);
    setIsBottomSheetVisible(false);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Unified checkout function that handles all payment methods via Stripe
  const onCheckoutPress = async () => {
    console.log("Selected payment method:", selectedMethod);

    try {
      setIsInitializing(true);

      const paymentService = PaymentService.getInstance();

      // Validate payment method
      if (!paymentService.validatePaymentMethod(selectedMethod)) {
        showToaster({
          message: "Selected payment method is not available",
          type: "error",
        });
        return;
      }

      const totalAmount =
        Number(currentPrice) *
        (Number(normalTicketPurchased) || Number(vipTicketPurchased));
      const quantity =
        Number(normalTicketPurchased) || Number(vipTicketPurchased);
      const ticketType = Number(vipTicketPurchased) ? "vip" : "normal";

      // Create payment intent for the selected method
      const paymentData = await paymentService.createEventTicketPayment(
        user?.uid || "",
        eventId as string,
        totalAmount,
        quantity,
        ticketType,
        selectedMethod
      );

      // Set payment data and show modal
      setPaymentData(paymentData);
      setIsPaymentModalVisible(true);
    } catch (error) {
      console.error("Error initializing payment:", error);
      showToaster({
        message: "Error initializing payment. Please try again.",
        type: "error",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePaymentSuccess = () => {
    handleTicketPurchase();
    router.push({
      pathname: "/eventScreens/tickets/ticket",
      params: {
        eventId: eventId,
        normalTicketPurchased: normalTicketPurchased,
        vipTicketPurchased: vipTicketPurchased,
      },
    });
  };

  const handleTicketPurchase = async () => {
    if (!user?.uid || !eventId) {
      console.error("User UID or Event ID not found");
      return;
    }

    try {
      const normalTickets = parseInt(normalTicketPurchased as string) || 0;
      const vipTickets = parseInt(vipTicketPurchased as string) || 0;

      await addOrUpdateTicketSale(
        eventId as string,
        user.uid,
        normalTickets,
        vipTickets,
        selectedMethod
      );

      console.log("Ticket purchase successful!");
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    }
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
        <RnText style={styles.headerTitle}>Payment</RnText>
        <RoundButton
          iconName="crop-free"
          iconSize={22}
          backgroundColour={Colors[theme].background}
          iconColor={Colors[theme].primary}
          onPress={() => router.push("/eventScreens/cardScan")}
        />
      </View>

      <RnText
        style={[styles.subtitle, { textAlign: "center", marginTop: hp(1) }]}
      >
        Choose your preferred payment method to buy tickets
      </RnText>

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
          <RnText style={styles.label}>Ticket Price</RnText>
          <RnText style={styles.value}>${currentPrice}</RnText>
        </View>
        <View style={styles.paymentRow}>
          <RnText style={styles.label}>Total</RnText>
          <RnText style={styles.value}>
            $
            {Number(currentPrice) *
              (Number(normalTicketPurchased) || Number(vipTicketPurchased))}
          </RnText>
        </View>
      </View>

      {/* <View style={styles.voucherSection}>
        <RnText style={styles.label}>Add Voucher</RnText>
        <View style={styles.voucherContainer}>
          <RnInput
            placeholder="VOUCHER CODE"
            containerStyle={styles.voucherInput}
            value={voucher}
            onChangeText={setVoucher}
            noError
          />
          <RnButton
            title="Apply"
            onPress={() => {}}
            style={[styles.applyButton, styles.applyText]}
          />
        </View>
      </View> */}

      <RnButton
        title="Checkout"
        style={[styles.checkoutBtn]}
        onPress={onCheckoutPress}
        loading={isInitializing}
      />

      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        enableDynamicSizing={true}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <View style={styles.modalBackground}>
          <Formik
            initialValues={initialValues}
            validationSchema={paymentValidationSchema}
            onSubmit={handlePaymentSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              setFieldValue,
            }) => (
              <View>
                <RnText style={styles.inputlabel}>Card Number</RnText>
                <RnBottomSheetInput
                  placeholder="3456 133112 50832"
                  value={values.cardNumber}
                  onChangeText={text =>
                    setFieldValue("cardNumber", formatCardNumber(text))
                  }
                  onBlur={handleBlur("cardNumber")}
                  error={errors.cardNumber}
                />

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: wp(2) }}>
                    <RnText style={styles.inputlabel}>Expiry Date</RnText>
                    <RnBottomSheetInput
                      placeholder="07/22"
                      value={values.expiryDate}
                      onChangeText={text =>
                        setFieldValue("expiryDate", formatExpiryDate(text))
                      }
                      onBlur={handleBlur("expiryDate")}
                      error={errors.expiryDate}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <RnText style={styles.inputlabel}>CVV</RnText>
                    <RnBottomSheetInput
                      placeholder="341"
                      value={values.cvv}
                      onChangeText={handleChange("cvv")}
                      onBlur={handleBlur("cvv")}
                      error={errors.cvv}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                </View>

                <RnButton
                  title="Confirm"
                  style={[styles.confirmBtn]}
                  onPress={() => handleSubmit()}
                />
              </View>
            )}
          </Formik>
        </View>
      </RnBottomSheet>

      {/* PaymentModal for Stripe payments */}
      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
        eventId={eventId as string}
        totalPrice={
          Number(currentPrice) *
          (Number(normalTicketPurchased) || Number(vipTicketPurchased))
        }
        paymentData={paymentData}
        paymentMethod={selectedMethod}
        isPreInitialized={true}
      />
    </Container>
  );
};

export default PaymentScreen;
