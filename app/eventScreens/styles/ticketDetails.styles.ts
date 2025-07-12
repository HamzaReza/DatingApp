import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: hp(1),
    },
    headerText: {
      color: Colors[theme].primary,
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.semiBold,
    },
    ticketTypeHeader: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.medium,
      marginTop: wp(6),
      marginBottom: wp(2),
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tabButton: {
      backgroundColor: "gray",
      borderRadius: Borders.radius2,
    },
    vipButton: {
      width: wp(42),
    },
    economyButton: {
      width: wp(42),
    },
    tabButtonActive: {
      backgroundColor: Colors[theme].primary,
    },
    tabText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.small,
    },
    seatSelectorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      backgroundColor: Colors[theme].primaryOpaque,
      borderRadius: Borders.radius1,
      // padding: wp(1),
      width: wp(92),
    },
    seatSelectorControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    seatButton: {
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
      borderRadius: Borders.radius1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors[theme].pink,
    },
    seatButtonText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.large,
    },
    seatCount: {
      fontSize: FontSize.large,
      color: Colors[theme].pink,
      textAlign: "center",
    },
    availableTickets: {
      fontSize: FontSize.small,
      color: Colors[theme].placeholderText,
      textAlign: "center",
      marginTop: hp(1),
    },
    singlePriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    mutiplyText: {
      width: "100%",
      textAlign: "right",
    },
    horizontaLine: {
      height: 2,
      backgroundColor: Colors[theme].gray,
      width: "100%",
      marginVertical: hp(3),
    },
    totalPrice: {
      color: Colors[theme].pink,
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
    },
    continueButton: {
      marginTop: hp(10),
      backgroundColor: Colors[theme].pink,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderText: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.medium,
    },
  });
