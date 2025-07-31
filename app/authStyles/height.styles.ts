import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    innerContainer: {
      flex: 1,
      justifyContent: "flex-start",
      marginBottom: hp(2),
    },
    title: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      width: wp(80),
      alignSelf: "center",
      marginTop: hp(10),
      marginBottom: hp(1),
      textAlign: "center",
    },
    subtitle: {
      fontSize: FontSize.small,
      width: wp(80),
      alignSelf: "center",
      textAlign: "center",
      marginBottom: hp(3),
    },
    pickerContainer: {
      height: hp(25),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp(2),
    },
    picker: {
      width: wp(60),
      height: hp(20),
    },
    pickerItem: {
      fontSize: FontSize.extraLarge,
      height: hp(4),
    },
    button: {
      marginTop: hp(2),
    },
  });
