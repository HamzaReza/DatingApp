import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 0,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
    },
    headerTitle: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].whiteText,
    },
    recentSection: {
      paddingHorizontal: wp(4),

      marginTop: hp(2),
    },
    recentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recentTitle: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].whiteText,
    },
    createGroupButton: {
      backgroundColor: Colors[theme].pink,
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.3),
      borderRadius: Borders.radius3,
      alignItems: "center",
      justifyContent: "center",
    },
    createGroupText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
    },
    recentMatchesList: {
      paddingLeft: wp(2),
      marginTop: hp(5),
    },
    recentMatchItem: {
      marginRight: wp(3),
    },
    recentMatchImageContainer: {
      position: "relative",
    },
    recentMatchImage: {
      width: wp(18),
      height: wp(21),
      borderRadius: Borders.radius2,
    },
    likesOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255,88,98,0.4)",
      borderRadius: Borders.radius1,
      justifyContent: "center",
      alignItems: "center",
    },
    likesText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),

      marginTop: -hp(2),
    },
    messagesList: {
      paddingHorizontal: wp(4),
    },

    gradientHeaderContainer: {
      height: hp(30),
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp(4),
      paddingTop: hp(4),
      paddingBottom: hp(2),
    },
    bottomSheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    checkboxContainer: {
      padding: 0,
      margin: 0,
      marginRight: wp(1),
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    bottomSheetContent: {
      padding: wp(4),
    },
    bottomSheetTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      marginBottom: hp(2),
      color: Colors[theme].blackText,
    },
    dropdownWrapper: {
      marginBottom: hp(2),
      width: wp(40),
    },
    dropdownLabel: {
      fontSize: FontSize.small,
      marginBottom: hp(1),
      color: Colors[theme].blackText,
    },
    createButton: {
      borderRadius: Borders.radius1,
      marginTop: hp(2),
    },
    createButtonText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
    },
    inputWrapper: {
      marginBottom: 0,
      height: hp(12),
    },
    inputLabel: {
      fontSize: FontSize.small,
      marginBottom: hp(1),
      color: Colors[theme].blackText,
    },
    inputStyle: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
      marginBottom: 0,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    addImageButton: {
      width: wp(40),
      height: wp(12),
      borderRadius: Borders.radius2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: Colors[theme].primary,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    wrapper: {},
  });
