import createStyles from "@/app/authStyles/otp.styles";
import RnButton from "@/components/RnButton";
import RnOtp from "@/components/RnOtp";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),
});

export default function OtpScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { phone } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = phone;

  const handleVerify = async (values: { otp: string }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/name");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {};

  return (
    <ScrollContainer topBar={<RnProgressBar progress={2 / 11} />}>
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={handleVerify}
        validateOnChange
        validateOnMount={false}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Verification Code</RnText>
            <RnText style={styles.subtitle}>
              Please enter code we just send to {"\n"}
              <RnText style={styles.phoneNumber}>{phoneNumber}</RnText>
            </RnText>
            <RnOtp
              value={values.otp}
              verifyCode={(code) => setFieldValue("otp", code)}
              isError={!!errors.otp}
              cell={4}
              style={styles.otp}
              error={errors.otp}
            />
            <RnText style={styles.resendText}>{`Didn't receive OTP?`}</RnText>
            <TouchableOpacity onPress={handleResend} style={undefined}>
              <RnText style={styles.link}>Resend Code</RnText>
            </TouchableOpacity>
            <RnButton
              title="Verify"
              style={[styles.verifyButton]}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
