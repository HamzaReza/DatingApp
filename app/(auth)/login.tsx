import createStyles from "@/app/authStyles/login.styles";
import RnButton from "@/components/RnButton";
import RnPhoneInput from "@/components/RnPhoneInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import {
  authenticateWithPhone,
  signInWithGoogleFirebase,
} from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setConfirmation, setToken, setUser } from "@/redux/slices/userSlice";
import { LoginValues } from "@/types";
import { SocialIcon } from "@rneui/base";
import { router } from "expo-router";
import { Formik } from "formik";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { OneSignal } from "react-native-onesignal";
import PhoneInput from "react-native-phone-number-input";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  phone: Yup.string().required("Phone is required"),
});

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [googleLoading, setGoogleLoading] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);

  const handleLogin = async (values: LoginValues) => {
    setIsLoading(true);

    try {
      const callingCode = `+${phoneInput.current?.state?.code}`;
      const cleanPhone = phoneInput?.current?.state?.number;

      const formattedPhone = `${callingCode}${cleanPhone}`;

      const confirmation = await authenticateWithPhone(formattedPhone);

      dispatch(setConfirmation(confirmation));

      router.push({
        pathname: "/otp",
        params: { phone: formattedPhone, login: "true" },
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const _handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const result = await signInWithGoogleFirebase(dispatch);

    if (result.success) {
      OneSignal.login(result.user.uid);
      console.log("OneSignal External User ID set:", result.user.uid);

      if (result.isNewUser) {
        router.push({
          pathname: "/signup",
          params: {
            email: result.user.email || "",
          },
        });
      } else {
        router.push("/main/home");
        dispatch(
          setUser({
            ...result.user,
            role: "user",
          })
        );
        dispatch(setToken(true));
      }
    } else {
      console.log("Google sign-in failed:", result.error);
    }

    setGoogleLoading(false);
  };

  return (
    <ScrollContainer>
      <Formik
        initialValues={{ phone: "3360102900" }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
        validateOnChange
        validateOnMount={false}
      >
        {({ handleChange, handleSubmit, values, errors, resetForm }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText
                style={styles.title}
              >{`Let's start with your number`}</RnText>
              <RnPhoneInput
                ref={phoneInput}
                value={values.phone}
                onChangeText={text => {
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
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <RnText style={styles.orText}>OR</RnText>
                <View style={styles.orLine} />
              </View>
              <View style={styles.socialContainer}>
                <SocialIcon
                  type="google"
                  onPress={_handleGoogleSignIn}
                  loading={googleLoading}
                />
                <SocialIcon
                  type="apple"
                  light
                  onPress={() => {
                    dispatch(setToken(true));
                    dispatch(
                      setUser({
                        role: "admin",
                      })
                    );
                    router.push("/dashboard");
                  }}
                  disabled={googleLoading}
                />
              </View>
            </View>
            <View style={styles.footer}>
              <RnText>{`Don't have an account? `}</RnText>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  router.push("/signup");
                }}
                disabled={isLoading}
              >
                <RnText style={styles.link}>Sign Up</RnText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
