import { Colors } from "@/constants/Colors";
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
      borderRadius: wp(6),
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
      fontWeight: "bold",
      color: Colors[theme].greenText,
      textAlign: "center",
      flex: 1,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].whiteText,
      borderRadius: wp(4),
      padding: wp(3),
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
      position: "relative",
    },
    cardRead: {
      opacity: 0.6,
    },
    avatar: {
      width: wp(14),
      height: wp(14),
      borderRadius: wp(3),
      marginRight: wp(3),
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Colors[theme].blackText,
      marginBottom: hp(0.5),
    },
    description: {
      fontSize: FontSize.regular,
      color: Colors[theme].tabIconDefault,
      marginBottom: hp(0.5),
    },
    time: {
      fontSize: FontSize.small,
      color: Colors[theme].tabIconDefault,
      opacity: 0.7,
    },
    unreadDot: {
      position: "absolute",
      top: hp(1),
      right: wp(3),
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(1.25),
      backgroundColor: Colors[theme].redText,
    },
  });
