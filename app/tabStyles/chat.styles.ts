import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },

    modalContainer: {
      height: hp(90), // Set height to 85% of the screen
      backgroundColor: Colors[theme].background,
      marginTop: "auto", // Push modal to the bottom
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 20,
    },

    dragHandleContainer: {
      alignItems: "center",
      paddingVertical: hp(1.5),
    },

    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: wp(4),
    },
    avatarContainer: {
      position: "relative",
      marginHorizontal: wp(3),
    },
    userAvatar: {
      width: wp(12),
      height: wp(12),
      borderRadius: Borders.radius4,
    },
    avatarBorder: {
      position: "absolute",
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: Borders.radius4,
      borderWidth: 2,
      borderColor: Colors[theme].redText,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].blackText,
      marginBottom: hp(0.3),
    },
    userStatus: {
      fontSize: FontSize.regular,
      color: Colors[theme].primary,
    },

    dateSeparator: {
      alignItems: "center",
      paddingVertical: hp(2),
      flexDirection: "row",
    },
    dateText: {
      fontSize: FontSize.regular,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
    },
    messagesList: {
      flex: 1,
    },
    messagesContent: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },
    messageContainer: {
      marginVertical: hp(1),
    },
    ownMessage: {
      alignItems: "flex-end",
    },
    otherMessage: {
      alignItems: "flex-start",
    },
    messageBubble: {
      maxWidth: "75%",
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      borderRadius: Borders.radius2,
      marginBottom: hp(0.5),
    },
    ownBubble: {
      backgroundColor: Colors[theme].sentMessage,
      borderRadius: Borders.radius1,
    },
    otherBubble: {
      backgroundColor: Colors[theme].recievedMessage,
      borderRadius: Borders.radius1,
    },
    messageText: {
      fontSize: FontSize.regular,
    },
    ownMessageText: {
      color: Colors[theme].blackText,
    },
    otherMessageText: {
      color: Colors[theme].blackText,
    },
    messageTime: {
      fontSize: FontSize.extraSmall,
      color: Colors[theme].blackText,
      marginHorizontal: wp(2),
    },
    inputContainer: {
      flexDirection: "row",
      paddingHorizontal: wp(4),

      backgroundColor: Colors[theme].background,
    },
    sendButton: {
      width: wp(12),
      height: wp(12),
      borderRadius: Borders.radius2,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors[theme].gray,
    },
    chatHeaderGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),
    },
    headerIconButton: {
      padding: wp(3),
      alignItems: "center",
      justifyContent: "center",
      borderColor: Colors[theme].tabIconDefault,
      borderWidth: 0.5,
      borderRadius: Borders.radius2,
      marginRight: wp(3),
    },
    dateLine: {
      flex: 1,
      height: 1,
      backgroundColor: Colors[theme].gray,
      marginHorizontal: wp(2),
    },

    // ...existing code...
    memberModalContainer: {
      backgroundColor: Colors[theme].background,
      padding: wp(5),
      borderRadius: Borders.radius3,
    },
    memberModalTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      marginBottom: hp(2),
      textAlign: "center",
    },
    memberItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].blackText,
    },
    memberAvatar: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      marginRight: wp(3),
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.medium,
    },
    memberStatus: {
      fontSize: FontSize.small,
      color: Colors[theme].tabIconDefault,
    },
    removeButton: {
      padding: wp(2),
    },
    confirmModalContainer: {
      backgroundColor: Colors[theme].background,
      padding: wp(6),
      borderRadius: Borders.radius3,
    },
    confirmModalText: {
      fontSize: FontSize.medium,
      textAlign: "center",
      marginBottom: hp(3),
    },
    confirmButtonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cancelButton: {
      flex: 1,
      marginRight: wp(2),
      backgroundColor: Colors[theme].tabIconDefault,
    },
    removeConfirmButton: {
      flex: 1,
      marginLeft: wp(2),
      backgroundColor: Colors[theme].tabIconDefault,
    },
    leftButton: {
      backgroundColor: Colors[theme].redText,
      alignSelf: "center",
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
      borderRadius: Borders.radius3,
      marginTop: wp(2),
    },
    leftText: {
      color: Colors[theme].whiteText,
    },
  });

// Payment Timer Styles
export const paymentStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    timerContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
      marginTop: hp(1),
    },
    timerLabel: {
      textAlign: "center",
      fontFamily: FontFamily.semiBold,
    },
    timerText: {
      color: Colors[theme].primary,
      textAlign: "center",
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
    },
  });

// UI Component Styles
export const uiStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    finalButton: {
      backgroundColor: Colors[theme].primary,
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      borderRadius: Borders.radius3,
      alignSelf: "center",
      marginVertical: hp(2),
    },
    finalText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    text: {
      color: Colors[theme].primary,
      textAlign: "center",
      fontSize: FontSize.small,
      marginHorizontal: wp(1.5),
      fontFamily: FontFamily.bold,
    },
    payNowContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
    payNowText: {
      color: Colors[theme].redText,
      textAlign: "center",
      fontSize: FontSize.medium,
      marginBottom: hp(2),
      fontFamily: FontFamily.medium,
    },
    payNowButton: {
      backgroundColor: Colors[theme].primary,
      width: wp(40),
      height: hp(5),
    },
    waitingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
    waitingText: {
      color: Colors[theme].redText,
      textAlign: "center",
      fontSize: FontSize.medium,
      fontFamily: FontFamily.medium,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    meetModalContainer: {
      width: "80%",
      backgroundColor: "white",
      padding: 20,
      borderRadius: 15,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
    },
    modalText: {
      fontSize: 16,
      marginVertical: 5,
      textAlign: "center",
    },
    modalCloseButton: {
      marginTop: 20,
      backgroundColor: "#FF6347",
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    modalCloseText: {
      color: "white",
      fontSize: 16,
    },
  });
