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
    centerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      color: Colors[theme].primary,
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.semiBold,
    },
    detailsContainer: {
      alignSelf: "center",
      marginHorizontal: wp(2),
      width: wp(100),
    },
  });
