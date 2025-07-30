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
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp(5),
      gap: wp(8),
    },
    option: {
      width: wp(25),
      height: wp(25),
      borderRadius: wp(12.5),
      borderWidth: 2,
      borderColor: "#E8E6EA",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    optionSelected: {
      borderColor: "#76CABB",
      backgroundColor: "#76CABB",
    },
    optionText: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.medium,
      color: "#000",
    },
    optionTextSelected: {
      color: "#FFF",
    },
    button: {
      marginTop: hp(5),
    },
    errorText: {
      color: "#DB4437",
      fontSize: FontSize.small,
      textAlign: "center",
      marginTop: hp(2),
    },
  });
