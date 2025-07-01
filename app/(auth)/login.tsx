import createStyles from "@/app/authStyles/login.styles";
import RnButton from "@/components/RnButton";
import RnPhoneInput from "@/components/RnPhoneInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setToken } from "@/redux/slices/userSlice";
import { LoginValues } from "@/types";
import { SocialIcon } from "@rneui/base";
import { router } from "expo-router";
import { Formik } from "formik";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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
  const handleLogin = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.dismissAll();
      router.push("/main/home");
      dispatch(setToken(true));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const phoneInput = useRef<PhoneInput>(null);

  return (
    <ScrollContainer>
      <Formik
        initialValues={{ phone: "" }}
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
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <RnText style={styles.orText}>OR</RnText>
                <View style={styles.orLine} />
              </View>
              <View style={styles.socialContainer}>
                <SocialIcon
                  type="google"
                  onPress={() => {
                    router.dismissAll();
                    router.push("/main/home");
                    dispatch(setToken(true));
                  }}
                />
                <SocialIcon
                  type="apple"
                  light
                  onPress={() => {
                    router.dismissAll();
                    router.push("/main/home");
                    dispatch(setToken(true));
                  }}
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
