import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { wp } from "@/utils";
import { StyleSheet } from "react-native";

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: wp(8),
      marginBottom: wp(4),
      paddingHorizontal: wp(4),
    },
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
      textAlign: "center",
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: wp(3),
    },
    avatar: {
      width: wp(36),
      height: wp(36),
      borderRadius: Borders.radius1,
      marginBottom: wp(2),
    },
    userName: {
      fontSize: wp(7),
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      textAlign: "center",
    },
    userBio: {
      fontSize: FontSize.medium,
      color: Colors[theme].gray,
      textAlign: "center",
      marginBottom: wp(4),
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: wp(2),
    },
    infoLabel: {
      fontSize: FontSize.large,
      color: Colors[theme].pink,
      fontFamily: FontFamily.semiBold,
      marginHorizontal: wp(1),
    },
    infoValue: {
      fontSize: FontSize.large,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
      marginRight: wp(4),
    },
    matchScore: {
      fontSize: FontSize.large,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: wp(3),
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].gray,
      borderRadius: Borders.radius1,
      paddingHorizontal: wp(3),
      paddingVertical: wp(2),
      marginHorizontal: wp(2),
    },
    iconContainer: {
      backgroundColor: Colors[theme].gray,
      borderRadius: Borders.radius1,
      padding: wp(1.5),
      marginRight: wp(2),
    },
    contactText: {
      fontSize: FontSize.regular,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.medium,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: wp(6),
    },
    statusButton: {
      borderWidth: 2,
      borderColor: Colors[theme].pink,
      borderRadius: Borders.radius1,
      paddingVertical: wp(2.5),
      paddingHorizontal: wp(7),
      marginHorizontal: wp(2),
      backgroundColor: "transparent",
    },
    statusButtonApproved: {
      backgroundColor: Colors[theme].pink,
      borderColor: Colors[theme].pink,
    },
    statusButtonRejected: {
      backgroundColor: Colors[theme].greenText,
      borderColor: Colors[theme].greenText,
    },
    statusButtonPending: {
      backgroundColor: "transparent",
      borderColor: Colors[theme].pink,
    },
    statusButtonText: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].pink,
      textAlign: "center",
    },
    statusButtonTextApproved: {
      color: Colors[theme].whiteText,
    },
    statusButtonTextRejected: {
      color: Colors[theme].whiteText,
    },
    statusButtonTextPending: {
      color: Colors[theme].pink,
    },
    statusTag: {
      alignSelf: "center",
      paddingHorizontal: wp(4),
      paddingVertical: wp(1.5),
      borderRadius: Borders.radius1,
      marginBottom: wp(2),
      marginTop: wp(1),
    },
    statusTagApproved: {
      backgroundColor: Colors[theme].greenText,
    },
    statusTagRejected: {
      backgroundColor: Colors[theme].redText,
    },
    statusTagPending: {
      backgroundColor: Colors[theme].tabIconDefault,
    },
    statusTagText: {
      color: Colors[theme].whiteText,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.regular,
      textAlign: "center",
    },
    contactColumn: {
      flexDirection: "column",
      marginTop: wp(2),
      marginBottom: wp(2),
      gap: wp(2),
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: wp(4),
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: wp(2),
    },
    radioOuter: {
      width: wp(5),
      height: wp(5),
      borderRadius: wp(2.5),
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
      borderRadius: wp(1.25),
      backgroundColor: Colors[theme].background,
    },
    radioLabel: {
      fontSize: FontSize.regular,
      fontFamily: FontFamily.bold,
      marginLeft: wp(1),
    },
    radioLabelApproved: {
      color: Colors[theme].greenText,
    },
    radioLabelRejected: {
      color: Colors[theme].pink,
    },
  });

export default createStyles;
