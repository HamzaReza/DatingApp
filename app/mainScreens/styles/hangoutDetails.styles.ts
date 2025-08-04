import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors[theme].background,
    },
    loadingText: {
      marginTop: hp(2),
      fontSize: FontSize.medium,
      color: Colors[theme].tabIconDefault,
    },

    groupImage: {
      width: "100%",
      height: hp(25),
      borderRadius: wp(4),
    },

    infoCard: {
      backgroundColor: Colors[theme].background,
      borderRadius: wp(4),
      padding: wp(4),
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginTop: wp(2),
    },
    groupName: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      marginBottom: hp(1),
    },
    groupDescription: {
      fontSize: FontSize.medium,
      color: Colors[theme].tabIconDefault,
      lineHeight: 22,
      marginBottom: hp(2),
    },

    invitedByText: {
      fontSize: FontSize.small,
      color: Colors[theme].primary,
      fontFamily: FontFamily.medium,
      marginLeft: wp(1),
    },
    detailsCard: {
      backgroundColor: Colors[theme].background,
      borderRadius: wp(4),
      padding: wp(4),
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      marginBottom: hp(2),
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: hp(2),
      gap: wp(4),
    },

    detailValue: {
      fontSize: FontSize.medium,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: wp(2),
    },
    tag: {
      backgroundColor: Colors[theme].primary + "20",
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: wp(4),
    },
    tagText: {
      fontSize: FontSize.small,
      color: Colors[theme].primary,
      fontFamily: FontFamily.bold,
    },
    usersCard: {
      backgroundColor: Colors[theme].background,
      borderRadius: wp(4),
      padding: wp(4),
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: hp(1),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].gray + "50",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    userAvatar: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      backgroundColor: Colors[theme].gray,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp(3),
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: wp(5),
    },
    userName: {
      fontSize: FontSize.medium,
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.5),
      borderRadius: wp(3),
    },
    statusText: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.bold,
      marginLeft: wp(1),
      textAlign: "center",
    },
    actionContainer: {
      flexDirection: "row",
      gap: wp(4),
      marginTop: hp(2),
      marginBottom: hp(4),
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(2),
      borderRadius: wp(3),
      gap: wp(2),
    },
    acceptButton: {
      backgroundColor: Colors[theme].primary,
    },
    rejectButton: {
      backgroundColor: Colors[theme].redText,
    },
    actionButtonText: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
      color: Colors[theme].whiteText,
    },
  });
