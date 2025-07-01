import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
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
    profileImage: {
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      borderColor: Colors[theme].primary,
      borderWidth: 2,
    },
    searchContainer: {
      width: "100%",
      marginTop: hp(2),
      marginBottom: hp(2),
    },
    searchInput: {
      width: "100%",
      height: hp(7),
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius2,
      paddingHorizontal: wp(4),
      color: Colors[theme].blackText,
      borderWidth: 1,
      borderColor: Colors[theme].gray,
      alignItems: "center",
      justifyContent: "center",
    },
    searchIconContainer: {
      position: "absolute",
      right: wp(4),
      top: hp(1.5),
      justifyContent: "center",
      alignItems: "center",
      borderColor: Colors[theme].pink,
      borderWidth: 1,
      borderRadius: Borders.circle,
      padding: wp(1),
      alignSelf: "center",
    },
    upcomingEventsContainer: {
      borderRadius: Borders.radius2,
    },
    upcomingEventsText: {
      fontSize: FontSize.large,
      color: Colors[theme].blackText,
      marginLeft: wp(2),
    },
    upcomingCardContainer: {
      paddingVertical: hp(2),
    },
    btnTxt: {
      fontSize: FontSize.small,
      color: Colors[theme].pink,
    },
    creatorShowCardContainer: {
      paddingVertical: wp(5),
    },
  });
