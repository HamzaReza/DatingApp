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
      paddingHorizontal: wp(4),
      paddingBottom: hp(1),
    },
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
      textAlign: "center",
    },
    statsContainer: {
      flexDirection: "row",
      // justifyContent: 'center',
      // alignItems: 'center',
      marginBottom: hp(3),
      gap: wp(8),
    },
    statItem: {
      alignItems: "center",
    },
    statCircle: {
      width: wp(16),
      height: wp(16),
      borderRadius: Borders.circle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp(1),
    },
    statNumber: {
      fontSize: FontSize.regular,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
    },
    statLabel: {
      fontSize: FontSize.regular,
      color: Colors[theme].greenText,
    },
    section: {
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].greenText,
      marginBottom: hp(2),
    },
    matchesList: {
      paddingBottom: hp(2),
    },
    row: {
      justifyContent: "center",
      paddingHorizontal: wp(2),
    },
    statTextContainers: {
      flexDirection: "row",
      gap: wp(2),
    },
  });
