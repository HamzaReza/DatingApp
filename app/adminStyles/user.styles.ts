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
    flatlist: {
      flex: 1,
      paddingTop: hp(2),
    },
    flatlistContainer: {
      flexGrow: 1,
    },
    flatlistColumnWrapper: {
      justifyContent: "space-between",
      marginBottom: hp(2),
      marginHorizontal: wp(1),
    },
    userCard: {
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius3,
      width: wp(44),
      padding: wp(3),
      alignItems: "center",
      shadowColor: Colors[theme].blackText,
      shadowOpacity: 0.08,
      shadowRadius: wp(2),
      elevation: 2,
    },
    avatar: {
      width: wp(16),
      height: wp(16),
      borderRadius: Borders.circle,
      marginBottom: hp(1),
    },
    userName: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      textAlign: "center",
    },
    userBio: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.regular,
      color: Colors[theme].placeholderText,
      textAlign: "center",
      marginBottom: hp(1),
    },
    userInfoRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp(0.5),
    },
    userInfoLabel: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.medium,
      color: Colors[theme].redText,
    },
    userInfoValue: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.medium,
      color: Colors[theme].blackText,
      marginRight: wp(2),
    },
    matchScore: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: hp(1),
    },
    contactText: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.regular,
      color: Colors[theme].blackText,
      marginLeft: wp(1),
      marginRight: wp(2),
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: hp(1),
    },
    statusButton: {
      borderRadius: Borders.radius1,
      paddingVertical: hp(0.7),
      marginHorizontal: wp(0.5),
      alignItems: "center",
      justifyContent: "center",
    },
    approved: {
      backgroundColor: Colors[theme].redText,
    },
    rejected: {
      backgroundColor: Colors[theme].greenText,
    },
    pending: {
      backgroundColor: Colors[theme].gray,
    },
    statusText: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.medium,
      color: Colors[theme].whiteText,
    },
    paginationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: hp(4),
      marginBottom: hp(15),
    },
    paginationButton: {
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[theme].whiteText,
      marginHorizontal: wp(1),
      shadowColor: Colors[theme].blackText,
      shadowOpacity: 0.08,
      shadowRadius: wp(1),
      elevation: 1,
    },
    paginationActive: {
      backgroundColor: Colors[theme].redText,
    },
    paginationText: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
    },
    paginationTextActive: {
      color: Colors[theme].whiteText,
    },
    contactColumn: {
      flexDirection: "column",
      alignItems: "flex-start",
      width: "90%",
    },
    iconContainer: {
      width: wp(8),
      height: wp(8),
      borderRadius: Borders.radius2,
      backgroundColor: "#FFF0F1",
      alignItems: "center",
      justifyContent: "center",
      marginRight: wp(1),
      shadowColor: Colors[theme].pink,
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "center",
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: wp(0.5),
    },
    radioOuter: {
      width: wp(5),
      height: wp(5),
      borderRadius: Borders.circle,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    radioApproved: {
      borderColor: Colors[theme].greenText,
    },
    radioRejected: {
      borderColor: Colors[theme].pink,
    },
    radioApprovedSelected: {
      backgroundColor: Colors[theme].greenText,
    },
    radioRejectedSelected: {
      backgroundColor: Colors[theme].pink,
    },
    radioInner: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].background,
    },
    radioLabel: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.bold,
      marginLeft: wp(1),
    },
    radioLabelApproved: {
      color: Colors[theme].greenText,
    },
    radioLabelRejected: {
      color: Colors[theme].pink,
    },
    statusTag: {
      position: "absolute",
      top: hp(1),
      right: wp(1),
      borderRadius: Borders.radius2,
      paddingHorizontal: wp(2),
      paddingVertical: 2,
      zIndex: 2,
      minWidth: 60,
      alignItems: "center",
    },
    statusTagApproved: {
      backgroundColor: Colors[theme].greenText,
    },
    statusTagRejected: {
      backgroundColor: Colors[theme].pink,
    },
    statusTagPending: {
      backgroundColor: Colors[theme].tabIconDefault,
    },
    statusTagText: {
      color: Colors[theme].whiteText,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.extraSmall,
      textAlign: "center",
      textTransform: "capitalize",
    },
  });
