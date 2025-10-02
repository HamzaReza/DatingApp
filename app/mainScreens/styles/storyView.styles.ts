import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    timelineContainer: {
      flexDirection: "row",
      alignSelf: "center",
      width: "92%",
      gap: wp(1.5),
    },
    timelineBarBg: {
      flex: 1,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 2,
      overflow: "hidden",
    },
    timelineBarFilled: {
      height: 4,
      backgroundColor: Colors[theme].pink,
      borderRadius: 2,
      width: "100%",
    },
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp(3),
      marginHorizontal: wp(4),
    },
    profileImage: {
      width: wp(13),
      height: wp(13),
      borderRadius: Borders.circle,
    },
    profileName: {
      color: Colors[theme].whiteText,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.small,
      marginLeft: wp(1.5),
    },
    storyImage: {
      width: wp(100),
      height: hp(100),
    },
    storyTouchable: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: hp(3),
    },
    inputWrapper: {
      paddingHorizontal: wp(4),
    },
    bottomView: {
      flexDirection: "row",
      alignItems: "center",
    },
    containerStyle: {
      marginRight: wp(2),
      flex: 1,
    },
    sendButton: {
      height: hp(6),
      width: hp(6),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: Borders.radius2,
      borderColor: Colors[theme].gray,
      borderWidth: 1,
    },
    inputContainerStyle: {
      borderWidth: 1,
      borderColor: Colors[theme].gray,
      borderRadius: Borders.radius2,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      height: hp(6),
    },
    inputStyle: {
      color: Colors[theme].whiteText,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: hp(5),
      paddingHorizontal: wp(4),
    },
    touchOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    videoContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    video: {
      width: "100%",
      height: "100%",
    },
    timestamp: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
      opacity: 0.8,
      marginLeft: wp(1.5),
    },
  });
