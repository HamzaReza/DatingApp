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
    button: {
      marginTop: hp(2),
    },
    optionsContainer: {
      width: wp(80),
      alignSelf: "center",
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: hp(2),
      marginBottom: hp(2),
      borderRadius: Borders.radius1,
      backgroundColor: "#F5F5F5",
    },
    optionSelected: {
      backgroundColor: Colors[theme].primary,
    },
    optionText: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.medium,
      marginLeft: wp(4),
    },
    optionTextSelected: {
      color: Colors[theme].whiteText,
    },
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.extraSmall,
      textAlign: "center",
      marginBottom: hp(1),
    },
    questionContainer: {
      marginBottom: hp(2),
    },
    questionText: {
      marginBottom: hp(1),
    },
    scaleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    scaleRightText: {
      marginRight: wp(2),
    },
    scaleLeftText: {
      marginLeft: wp(2),
    },
    scaleButton: {
      width: wp(6.5),
      height: wp(6.5),
      borderRadius: Borders.circle,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
      borderWidth: 1,
    },
    scaleText: {
      fontFamily: FontFamily.bold,
    },
  });
