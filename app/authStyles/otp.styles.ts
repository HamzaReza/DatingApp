import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    innerContainer: {
      flex: 1,
      marginBottom: hp(2),
    },
    title: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      marginTop: hp(6),
      alignSelf: "center",
      textAlign: "center",
    },
    phoneNumber: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.large,
    },
    subtitle: {
      fontSize: FontSize.small,
      width: wp(70),
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(2),
    },
    otp: {
      alignSelf: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: hp(3),
    },
    resendText: {
      textAlign: "center",
      marginVertical: hp(1),
    },
    link: {
      color: Colors[theme].greenText,
      fontFamily: FontFamily.bold,
      alignSelf: "center",
    },
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.extraSmall,
      textAlign: "center",
      marginBottom: hp(1),
    },
    verifyButton: {
      marginTop: hp(2),
    },
  });
