import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      padding: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    backgroundImage: {
      width: wp(100),
      height: hp(100),
      position: "absolute",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      paddingHorizontal: wp(10),
      backgroundColor: "rgba(255,179,186,0.9)",
      borderRadius: Borders.radius2,
      marginHorizontal: wp(20),
      marginTop: hp(2),
      alignSelf: "center",
      gap: wp(10),
    },
    topBarButton: {
      width: wp(12),
      height: wp(12),
      // borderRadius: wp(6),
      justifyContent: "center",
      alignItems: "center",
    },
    profileInfo: {
      position: "absolute",
      bottom: hp(21),
      left: wp(6),
      right: wp(6),
    },
    nameText: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors.light.whiteText,
      marginBottom: hp(0.5),
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    professionText: {
      fontSize: FontSize.large,
      color: Colors.light.whiteText,
      marginBottom: hp(2),
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    tagsContainer: {
      gap: hp(1),
      alignItems: "center",
      zIndex: 1,
    },
    tagRow: {
      flexDirection: "row",
      gap: wp(3),
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(2),
      borderRadius: Borders.radius2,
      backgroundColor: "rgba(255,255,255,0.25)",
      backdropFilter: "blur(10px)",
      borderColor: Colors[theme].whiteText,
      borderWidth: 0.5,
    },

    distanceText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    privateText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    activeText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    practicingText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    flagText: {
      fontSize: FontSize.small,
    },
    countryText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    matchText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    trustText: {
      color: Colors.light.whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(1),
    },
    actionButtons: {
      position: "absolute",
      bottom: hp(13),
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: wp(4),
      zIndex: 1,
    },
    actionButton: {
      width: wp(12),
      height: wp(12),
      borderRadius: Borders.circle,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    refreshButton: {
      backgroundColor: Colors.light.pink,
    },
    dislikeButton: {
      backgroundColor: Colors.light.pink,
    },
    likeButton: {
      backgroundColor: Colors.light.pink,
    },
    superLikeButton: {
      backgroundColor: Colors.light.pink,
    },
  });
