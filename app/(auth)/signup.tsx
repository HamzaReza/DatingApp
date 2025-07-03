import createStyles from "@/app/authStyles/signup.styles";
import RnButton from "@/components/RnButton";
import RnPhoneInput from "@/components/RnPhoneInput";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { authenticateWithPhone } from "@/firebase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setConfirmation } from "@/redux/slices/userSlice";
import { SignupValues } from "@/types";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const signupSchema = Yup.object().shape({
  phone: Yup.string().required("Phone is required"),
});

export default function Signup() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const dispatch = useDispatch();

  const handleSignup = async (values: SignupValues) => {
    setIsLoading(true);
    try {
      const callingCode = `+${phoneInput.current?.state?.code}`;
      const cleanPhone = phoneInput?.current?.state?.number;

      const formattedPhone = `${callingCode}${cleanPhone}`;

      const confirmation = await authenticateWithPhone(formattedPhone);

      dispatch(setConfirmation(confirmation));

      router.push({
        pathname: "/otp",
        params: { phone: formattedPhone },
      });
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={1 / 11} />}>
      <Formik
        initialValues={{ phone: __DEV__ ? "3360102900" : "" }}
        validationSchema={signupSchema}
        onSubmit={handleSignup}
        validateOnChange
        validateOnMount={false}
      >
        {({ handleChange, handleSubmit, values, errors, resetForm }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText style={styles.title}>Create your account</RnText>
              <RnText
                style={styles.subtitle}
              >{`We'll need your phone number to send an OTP for verification.`}</RnText>
              <RnPhoneInput
                ref={phoneInput}
                value={values.phone}
                onChangeText={(text) => {
                  handleChange("phone")(text);
                }}
                error={errors.phone}
              />
              <RnButton
                title="Continue"
                style={[styles.button]}
                onPress={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>
            <View style={styles.footer}>
              <RnText>{`Already have an account? `}</RnText>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  router.push("/login");
                }}
                disabled={isLoading}
              >
                <RnText style={styles.link}>Login</RnText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
