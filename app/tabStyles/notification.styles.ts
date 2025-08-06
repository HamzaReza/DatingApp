import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: hp(2),
    },
    backBtn: {
      padding: wp(2),
      borderRadius: Borders.circle,
      backgroundColor: "rgba(255,255,255,0.9)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].greenText,
      textAlign: "center",
      flex: 1,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius3,
      padding: wp(3),
      marginBottom: hp(2),
    },
    unreadCard: {
      backgroundColor: Colors[theme].notificationUnread,
    },
    avatar: {
      width: wp(14),
      height: wp(14),
      borderRadius: Borders.radius3,
      marginRight: wp(3),
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].whiteText,
      marginBottom: hp(0.5),
    },
    readTitle: {
      fontFamily: FontFamily.regular,
      color: Colors[theme].blackText,
    },
    description: {
      color: Colors[theme].tabIconDefault,
      marginBottom: hp(0.5),
    },
    readDescription: {
      color: Colors[theme].blackText,
    },
    time: {
      fontSize: FontSize.small,
      color: Colors[theme].tabIconDefault,
      opacity: 0.7,
      textAlign: "right",
    },
    unreadDot: {
      position: "absolute",
      top: hp(1),
      right: wp(3),
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].redText,
    },
    buttonContainer: {
      width: wp(40),
      height: hp(4),
      marginVertical: hp(1),
    },
    buttonText: {
      color: Colors[theme].whiteText,
    },
    acceptedText: {
      color: Colors[theme].primary,
      marginTop: 4,
    },
    rejectedText: {
      color: Colors[theme].tabIconDefault,
      marginTop: 4,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      textAlign: "center",
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
    },
    separator: {
      height: 1,
      backgroundColor: Colors[theme].gray,
      marginHorizontal: wp(3),
      marginVertical: hp(1),
    },
  });
