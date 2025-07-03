import createStyles from "@/app/eventScreens/styles/paymentScreen.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnInput from "@/components/RnInput";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { wp } from "@/utils";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import * as Yup from "yup";

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
];

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("apple");
  const [voucher, setVoucher] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

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
    // Handle payment submission here
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

      <View style={styles.section}>
        <RnText style={styles.label}>Payment Method</RnText>
        <TouchableOpacity
          style={styles.addCard}
          onPress={() => setIsBottomSheetVisible(true)}
        >
          <RnText style={styles.addCardText}>Add New Card</RnText>
        </TouchableOpacity>
      </View>

      {/* Payment Options */}
      {paymentMethods.map((item) => (
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

      {/* Debit/Credit Option */}
      <TouchableOpacity style={styles.radioRowForPayment}>
        <View style={styles.unselectedRadio} />
        <RnText style={styles.methodName}>Pay by Debit / Credit Card</RnText>
      </TouchableOpacity>

      {/* Existing Card */}
      <View style={styles.cardItem}>
        <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />
        <RnText style={styles.cardText}>**** **** **** 0213</RnText>
      </View>

      {/* Voucher */}
      <View style={styles.voucherSection}>
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
      </View>

      <RnButton
        title="Checkout"
        style={[styles.checkoutBtn]}
        onPress={() => router.push("/eventScreens/ticket")}
      />

      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        enableDynamicSizing={true}
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
                <RnInput
                  placeholder="3456 133112 50832"
                  value={values.cardNumber}
                  onChangeText={(text) =>
                    setFieldValue("cardNumber", formatCardNumber(text))
                  }
                  onBlur={handleBlur("cardNumber")}
                  error={errors.cardNumber}
                />

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: wp(2) }}>
                    <RnText style={styles.inputlabel}>Expiry Date</RnText>
                    <RnInput
                      placeholder="07/22"
                      value={values.expiryDate}
                      onChangeText={(text) =>
                        setFieldValue("expiryDate", formatExpiryDate(text))
                      }
                      onBlur={handleBlur("expiryDate")}
                      error={errors.expiryDate}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <RnText style={styles.inputlabel}>CVV</RnText>
                    <RnInput
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
    </Container>
  );
};

export default PaymentScreen;
