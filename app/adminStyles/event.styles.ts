import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
      textAlign: "center",
    },
    ticketCardWrapper: {
      marginTop: hp(4),
      alignItems: "center",
      marginBottom: hp(4),
    },
    ticketCard: {
      backgroundColor: Colors[theme].primary,
      borderRadius: Borders.radius2,
      width: wp(90),
      padding: wp(5),
      alignItems: "center",
    },
    eventTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      marginBottom: hp(2),
      textAlign: "center",
    },
    rowWrap: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: hp(1.5),
    },
    label: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.medium,
    },
    value: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
      marginTop: hp(0.5),
      fontFamily: FontFamily.regular,
    },
    qrSection: {
      alignItems: "center",
      marginTop: hp(2),
    },
    qr: {
      width: wp(30),
      height: wp(30),
    },
    createBtn: {
      marginTop: hp(6),
      backgroundColor: Colors[theme].pink,
      width: wp(70),
      height: hp(5),
    },
    dashedLine: {
      borderBottomWidth: 2,
      borderStyle: "dashed",
      borderColor: Colors[theme].background,
      width: "100%",
      marginVertical: hp(2),
    },
  });
