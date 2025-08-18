import createStyles from "@/app/authStyles/otp.styles";
import RnButton from "@/components/RnButton";
import RnOtp from "@/components/RnOtp";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import { Colors } from "@/constants/Colors";
import {
  authenticateWithPhone,
  checkGuardianMobileNumber,
  getUserByGuardianPhone,
  getUserByUidAsync,
  saveUserToDatabase,
  verifyCode,
} from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setConfirmation, setToken, setUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { OneSignal } from "react-native-onesignal";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

export default function OtpScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const { confirmation } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const styles = createStyles(theme);
  const { phone, login } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (values: { otp: string }) => {
    setIsLoading(true);
    try {
      await verifyCode(confirmation, values.otp)
        .then(async () => {
          const auth = getAuth();
          const user = auth.currentUser;

          if (user) {
            const existingUser = await getUserByUidAsync(user.uid);

            if (existingUser) {
              if (existingUser.isProfileComplete) {
                if (existingUser.status === "pending") {
                  showToaster({
                    type: "error",
                    message: "Waiting for approval",
                  });
                } else if (existingUser.status === "rejected") {
                  showToaster({
                    type: "error",
                    message: "Account blocked. Contact support",
                  });
                } else {
                  AsyncStorage.clear();
                  router.dismissAll();
                  OneSignal.login(existingUser.uid);
                  router.push("/main/home");
                  dispatch(setToken(true));
                  dispatch(setUser(existingUser));
                }
              } else {
                AsyncStorage.clear();
                router.push({ pathname: "/name", params: { phone: phone } });
              }
            } else {
              await checkGuardianMobileNumber(phone as string).then(
                async res => {
                  if (res.inGuardian) {
                    getUserByGuardianPhone(phone as string)
                      .then((userWithGuardian: any) => {
                        if (userWithGuardian.status === "pending") {
                          showToaster({
                            type: "error",
                            message: "Waiting for approval",
                          });
                        } else if (userWithGuardian.status === "rejected") {
                          showToaster({
                            type: "error",
                            message: "Account blocked. Contact support",
                          });
                        } else {
                          AsyncStorage.clear();
                          router.dismissAll();
                          router.push("/main/home");
                          dispatch(setToken(true));
                          OneSignal.login(userWithGuardian.uid);
                          dispatch(setUser(userWithGuardian));
                        }
                      })
                      .catch(() => {
                        showToaster({
                          type: "error",
                          message: "Error retrieving user account",
                        });
                      });
                  } else {
                    await saveUserToDatabase(user.uid, {
                      phone: phone as string,
                    }).then(() => {
                      AsyncStorage.clear();
                      router.push({
                        pathname: "/name",
                        params: { phone: phone },
                      });
                    });
                  }
                }
              );
            }
          }
        })
        .catch(error => {
          console.error("Verification error:", error);
        });
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const confirmation = await authenticateWithPhone(phone as string);
    dispatch(setConfirmation(confirmation));
  };

  return (
    <ScrollContainer
      topBar={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="house"
            size={24}
            color={Colors[theme].primary}
            style={{ marginLeft: wp(5) }}
            onPress={() => router.dismissAll()}
          />
          {!login && <RnProgressBar progress={2 / 15} />}
        </View>
      }
    >
      <Formik
        initialValues={{ otp: __DEV__ ? "123456" : "" }}
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
              <RnText style={styles.phoneNumber}>{phone}</RnText>
            </RnText>
            <RnOtp
              value={values.otp}
              verifyCode={code => setFieldValue("otp", code)}
              isError={!!errors.otp}
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
