import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      marginBottom: hp(2),
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleText: {
      fontFamily: FontFamily.bold,
      color: Colors[theme].greenText,
      fontSize: FontSize.extraLarge,
    },
    headerIconContainer: {
      flexDirection: "row",
      gap: wp(2),
    },
    storiesContainer: {
      marginBottom: hp(1),
    },
    storiesList: {
      paddingLeft: wp(2),
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: Colors[theme].primaryOpaque,
      borderRadius: Borders.radius3,
      marginBottom: hp(1),
      padding: wp(1.5),
    },
    tab: {
      flex: 1,
      paddingVertical: hp(1),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Borders.radius3,
    },
    activeTab: {
      backgroundColor: Colors[theme].background,
      elevation: 2,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    tabText: {
      textAlign: "center",
      color: Colors[theme].greenText,
  fontFamily:FontFamily.semiBold,
    },
    activeTabText: {
      color: Colors[theme].redText,
      fontFamily: FontFamily.bold, // dont
    },
  });
