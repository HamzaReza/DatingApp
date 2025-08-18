/* eslint-disable react-hooks/exhaustive-deps */
import { VideoProvider } from "@/components/VideoContext";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { configureFirebaseEmulators } from "@/firebase/config";
import { useColorScheme } from "@/hooks/useColorScheme";
import { persistor, store } from "@/redux/store";
import { hp, wp } from "@/utils/Dimensions";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OneSignal } from "react-native-onesignal";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastProps,
} from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const APP_ID: any = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

  useEffect(() => {
    OneSignal.initialize(APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
  });

  configureFirebaseEmulators();

  if (!loaded) {
    return null;
  }

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    loadingView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    headingText: {
      fontSize: FontSize.medium,
      color: Colors[theme].blackText,
    },
    messageText: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
    },
    successToast: {
      borderLeftColor: Colors[theme].primary,
      borderLeftWidth: wp(3),
      height: undefined,
      paddingVertical: hp(0.5),
    },
    errorToast: {
      borderLeftColor: Colors[theme].pink,
      borderLeftWidth: wp(3),
      height: undefined,
      paddingVertical: hp(0.5),
    },
    infoToast: {
      borderLeftColor: Colors[theme].primary,
      borderLeftWidth: wp(3),
      height: undefined,
      paddingVertical: hp(0.5),
    },
  });

  const toastConfig = {
    success: (props: ToastProps) => (
      <BaseToast
        {...props}
        text1Style={styles.headingText}
        text2Style={styles.messageText}
        style={styles.successToast}
        text1NumberOfLines={10}
        text2NumberOfLines={10}
      />
    ),
    error: (props: ToastProps) => (
      <ErrorToast
        {...props}
        text1Style={styles.headingText}
        text2Style={styles.messageText}
        style={styles.errorToast}
        text1NumberOfLines={10}
        text2NumberOfLines={10}
      />
    ),
    info: (props: ToastProps) => (
      <InfoToast
        {...props}
        text1Style={styles.headingText}
        text2Style={styles.messageText}
        style={styles.infoToast}
        text1NumberOfLines={10}
        text2NumberOfLines={10}
      />
    ),
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.main}>
          <Provider store={store}>
            <PersistGate
              loading={
                <View style={styles.loadingView}>
                  <ActivityIndicator size="large" />
                </View>
              }
              persistor={persistor}
            >
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StripeProvider
                  publishableKey={
                    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
                  }
                >
                  <VideoProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="(admin)" />
                      <Stack.Screen name="+not-found" />
                      <Stack.Screen name="eventScreens/explore" />
                    </Stack>
                  </VideoProvider>
                </StripeProvider>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </SafeAreaView>
      </BottomSheetModalProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
