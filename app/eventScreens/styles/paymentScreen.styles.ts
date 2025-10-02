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
    headerTitle: {
      color: Colors[theme].primary,
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.semiBold,
    },
    subtitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
    },
    paymentSection: {
      marginTop: hp(1),
      borderWidth: 1,
      borderColor: Colors[theme].primary,
      padding: wp(2),
      borderRadius: Borders.radius1,
    },
    paymentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    label: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.semiBold,
    },
    value: {
      fontSize: FontSize.medium,
    },
    addCard: {},
    addCardText: {
      fontSize: FontSize.small,
      color: Colors[theme].redText,
    },
    methodButton: {
      marginTop: hp(3),
      borderWidth: 1,
      borderRadius: Borders.radius1,
      borderColor: Colors[theme].primary,
      backgroundColor: Colors[theme].primaryOpaque,
      height: hp(6),
      justifyContent: "center",
      paddingHorizontal: wp(2),
    },
    methodName: {
      fontSize: FontSize.medium,
      color: Colors[theme].blackText,
    },
    cardItem: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: Borders.radius1,
      borderColor: Colors[theme].primary,
      backgroundColor: Colors[theme].primaryOpaque,
      height: hp(6),
      paddingHorizontal: wp(2),
      marginTop: hp(2),
      width: "80%",
      alignSelf: "center",
    },
    cardText: {
      fontSize: FontSize.medium,
      color: Colors[theme].redText,
      marginLeft: wp(3),
    },
    voucherContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    voucherInput: {
      width: wp(50),
    },
    applyButton: {
      width: wp(30),
      borderRadius: Borders.radius1,
    },
    applyText: {
      color: Colors[theme].whiteText,
      fontFamily: FontFamily.semiBold,
    },
    checkoutText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
    },
    selectedRadio: {
      width: wp(5),
      height: wp(5),
      borderRadius: Borders.circle,
      borderWidth: 2,
      borderColor: Colors[theme].primary,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[theme].whiteText,
    },
    unselectedRadio: {
      width: wp(5),
      height: wp(5),
      borderRadius: Borders.circle,
      borderWidth: 2,
      borderColor: "#aaa",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[theme].whiteText,
    },
    radioDot: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].primary,
    },
    radioRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp(3),
    },
    radioRowForPayment: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp(3),
      marginVertical: wp(4),
    },
    checkoutBtn: {
      marginTop: hp(1),
      backgroundColor: Colors[theme].pink,
    },
    voucherSection: {
      marginTop: hp(2),
      marginBottom: hp(10),
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalBackground: {
      paddingBottom: hp(4),
    },
    inputlabel: {
      fontSize: FontSize.medium,
      marginBottom: hp(1),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    saveRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp(2),
      marginBottom: hp(4),
    },
    circleCheck: {
      width: wp(5),
      height: wp(5),
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].greenText,
      marginRight: wp(3),
    },
    saveLabel: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.small,
    },
    confirmBtn: {
      backgroundColor: Colors[theme].greenText,
      paddingVertical: hp(1),
      borderRadius: Borders.radius4,
      alignItems: "center",
    },
    confirmText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.medium,
      fontFamily: FontFamily.semiBold,
    },
    bottomSheetBackground: {
      backgroundColor: Colors[theme].pink,
    },
    bottomSheetHandle: {
      backgroundColor: Colors[theme].pink,
      borderTopLeftRadius: wp(10),
      borderTopRightRadius: wp(10),
    },
    bottomSheetContainer: {
      flex: 1,
    },
    bottomSheetContent: {
      flex: 1,
      paddingHorizontal: 0,
    },
    paymentMethodInfo: {
      marginTop: hp(3),
      borderWidth: 1,
      borderRadius: Borders.radius1,
      borderColor: Colors[theme].primary,
      backgroundColor: Colors[theme].primaryOpaque,
      padding: wp(2),
    },
    paymentMethodNote: {
      fontSize: FontSize.small,
      color: Colors[theme].placeholderText,
      textAlign: "center",
      marginTop: hp(1),
    },
  });
