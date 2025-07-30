import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
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
      marginTop: hp(5),
      paddingHorizontal: wp(5),
    },
    option: {
      alignItems: "center",
      padding: hp(2),
      marginBottom: hp(2),
      justifyContent: "center",
      width: wp(32),
      height: wp(32),
      borderRadius: Borders.circle,
      borderWidth: 2,
      borderColor: Colors[theme].primary,
      backgroundColor: "transparent",
    },
    optionSelected: {
      backgroundColor: Colors[theme].primary,
    },
    optionText: {
      fontFamily: FontFamily.medium,
      textAlign: "center",
    },
    optionTextSelected: {
      color: Colors[theme].whiteText,
    },
    button: {
      marginTop: hp(5),
    },
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.extraSmall,
      textAlign: "center",
      marginBottom: hp(1),
    },
  });
