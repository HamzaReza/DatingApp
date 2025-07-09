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
      fontFamily: FontFamily.semiBold,
    },
    value: {
      fontSize: FontSize.small,
      marginTop: hp(0.5),
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
      marginTop: hp(2),
      backgroundColor: Colors[theme].pink,
      width: wp(70),
      height: hp(5),
    },
    dashedLine: {
      borderBottomWidth: 2,
      borderStyle: "solid",
      borderColor: Colors[theme].background,
      width: "100%",
      marginVertical: hp(2),
    },
    priceContainer: {
      alignItems: "center",
      marginBottom: hp(2),
    },
    priceText: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].pink,
    },
    // Form styles
    formScrollView: {
      flex: 1,
    },
    formContainer: {
      paddingVertical: hp(2),
    },
    formTitle: {
      textAlign: "center",
      marginBottom: hp(3),
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
    },
    formRowContainer: {
      flexDirection: "row",
      marginBottom: hp(3),
    },
    formGenreInput: {
      marginVertical: hp(1),
    },
    formHalfField: {
      flex: 1,
    },
    formHalfFieldLeft: {
      marginRight: wp(2),
    },
    formHalfFieldRight: {
      marginLeft: wp(2),
    },
    formErrorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.regular,
      marginBottom: hp(2),
    },
    modalCreateBtn: {
      marginBottom: hp(5),
      backgroundColor: Colors[theme].pink,
      width: wp(70),
      height: hp(5),
    },
    formSeparator: {
      width: wp(1),
    },
    smallBtn:{

    },
    secondaryButton:{
      
    }
  });
