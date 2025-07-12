import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
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
    flatlist: {
      paddingTop: hp(2),
    },
    flatlistColumnWrapper: {
      justifyContent: "space-between",
      marginBottom: hp(2),
      marginHorizontal: wp(1),
    },
    statCard: {
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius3,
      paddingHorizontal: wp(2),
      paddingVertical: hp(2),
      alignItems: "center",
      justifyContent: "space-between",
      width: wp(43),
      height: hp(18),
      shadowColor: Colors[theme].blackText,
      shadowOpacity: 0.1,
      shadowRadius: wp(3),
      elevation: 4,
    },
    topStat: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    statValue: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].primary,
      marginBottom: hp(0.3),
    },
    statLabel: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
      marginBottom: hp(0.5),
      fontFamily: FontFamily.medium,
      textAlign: "center",
    },
    statChange: {
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.medium,
      marginTop: hp(0.2),
      textAlign: "center",
    },
    chartCard: {
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius3,
      marginBottom: hp(2.5),
      shadowColor: Colors[theme].blackText,
      shadowOpacity: 0.1,
      shadowRadius: wp(3),
      elevation: 4,
      padding: wp(2),
    },
    sectionTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].blackText,
      marginBottom: hp(1.2),
      padding: wp(4),
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp(1.2),
    },
    dropdown: {
      width: wp(35),
      height: hp(3),
    },
    dropdownContainer: {
      width: wp(35),
    },
    bottomSpacer: {
      height: hp(10),
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      justifyContent: "center",
      alignItems: "center",
    },
  });
