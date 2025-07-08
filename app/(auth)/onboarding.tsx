import createStyles from "@/app/authStyles/onboarding.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { signInWithGoogleFirebase } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Onboarding({ navigation }: any) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const [googleLoading, setGoogleLoading] = useState(false);

  const _handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    const result = await signInWithGoogleFirebase();
    if (result.success) {
      dispatch(
        setUser({
          ...result.user,
          role: "user",
        })
      );

      if (result.isNewUser) {
        router.push({
          pathname: "/signup",
          params: {
            email: result.user.email || "",
          },
        });
      } else {
        router.push("/main/home");
      }
    } else {
      console.log("Google sign-in failed:", result.error);
    }
    setGoogleLoading(false);
  };

  return (
    <Container>
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        {/* <TouchableOpacity
          style={styles.socialButton}
          onPress={_handleGoogleSignIn}
        >
          <View style={styles.iconContainer}>
            <FontAwesome
              name="google"
              size={24}
              color={Colors[theme].redText}
            />
          </View>
          <RnText style={styles.socialwhiteText}>Login with Google</RnText>
        </TouchableOpacity> */}

        <RnButton
          title="Login with Google"
          icon="google"
          style={[styles.socialButton, styles.socialwhiteText]}
          onPress={_handleGoogleSignIn}
          noRightIcon
          leftIconColor={Colors[theme].redText}
          loading={googleLoading}
          loaderColor={Colors[theme].redText}
        />

        <RnButton
          title="Login with Google"
          icon="apple"
          style={[styles.socialButton, styles.socialwhiteText]}
          onPress={() => {
            dispatch(setToken(true));
            dispatch(
              setUser({
                role: "admin",
              })
            );
          }}
          noRightIcon
          leftIconColor={Colors[theme].blackText}
          disabled={googleLoading}
        />

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push("/getStarted")}
        >
          <RnText style={styles.emailwhiteText}>Continue with Phone</RnText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <RnText style={styles.footerText}>
            By Continuing you agree to our{" "}
            <RnText
              style={styles.footerLink}
              onPress={() => {
                // Navigate to Terms
              }}
            >
              Terms
            </RnText>
            {" & "}
            <RnText
              style={styles.footerLink}
              onPress={() => {
                // Navigate to Privacy Policy
              }}
            >
              Privacy
            </RnText>
          </RnText>
        </View>
      </View>
    </Container>
  );
}
