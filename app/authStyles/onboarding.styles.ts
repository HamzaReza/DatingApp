import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    backgroundImage: {
      width: wp(100),
      height: hp(100),
      position: "absolute",
    },
    content: {
      flex: 1,
      justifyContent: "flex-end",
      marginBottom: hp(8),
      paddingHorizontal: wp(4),
    },

    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: Borders.radius2,
      padding: hp(1),
      marginTop: hp(1),
      paddingHorizontal: wp(4),
      elevation: 0,
    },
    iconContainer: {
      backgroundColor: "white",
      borderRadius: Borders.circle,
      width: wp(10),
      height: wp(10),
      justifyContent: "center",
      alignItems: "center",
    },
    socialwhiteText: {
      fontSize: FontSize.medium,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
      marginLeft: wp(3),
    },
    emailButton: {
      alignItems: "center",
      marginTop: hp(1),
    },
    emailwhiteText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.small,
      fontFamily: FontFamily.bold,
    },
    footer: {
      alignItems: "center",
      marginTop: hp(3),
    },
    footerText: {
      color: Colors[theme].whiteText,
    },
    footerLink: {
      color: Colors[theme].redText,
      fontFamily: FontFamily.bold,
      textDecorationLine: "underline",
    },
  });
