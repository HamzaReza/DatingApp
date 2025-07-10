import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
      textAlign: "center",
    },
    planCardWrapper: {
      marginTop: hp(4),
      alignItems: "center",
      marginBottom: hp(4),
    },
    planCard: {
      backgroundColor: Colors[theme].primary,
      borderRadius: Borders.radius2,
      width: wp(90),
      padding: wp(5),
      alignItems: "center",
    },
    planTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      marginBottom: hp(2),
      textAlign: "center",
    },
    planDescription: {
      fontSize: FontSize.regular,
      fontFamily: FontFamily.regular,
      marginBottom: hp(1.5),
      textAlign: "center",
    },
    planFeatures: {
      width: "100%",
      marginBottom: hp(1.5),
    },
    featureItem: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.medium,
      marginBottom: hp(0.5),
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
    durationText: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].gray,
      marginBottom: hp(1),
    },
    createBtn: {
      marginTop: hp(2),
      backgroundColor: Colors[theme].pink,
      width: wp(70),
      height: hp(5),
    },
    // Form styles
    formScrollView: {
      flexGrow: 1,
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
      fontSize: FontSize.extraSmall,
      marginBottom: hp(2),
      marginLeft: wp(1),
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
    featureRow: {
      flexDirection: "row",
    },
    featureInputContainer: {
      flex: 1,
    },
    featureButtonsContainer: {
      flexDirection: "row",
      alignSelf: "flex-start",
    },
    featureButton: {
      width: wp(8),
      height: hp(4),
      marginLeft: wp(2),
      marginTop: hp(1),
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      textAlign: "center",
      fontSize: FontSize.regular,
      fontFamily: FontFamily.regular,
    },
  });

export default createStyles;
