import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
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
      borderRadius: Borders.circle,
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
     fontFamily:FontFamily.semiBold,
      color: Colors[theme].greenText,
      textAlign: "center",
      flex: 1,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].whiteText,
      borderRadius: Borders.radius3,
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
      borderRadius: Borders.radius3,
      marginRight: wp(3),
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: FontSize.large,
      fontFamily:FontFamily.semiBold,
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
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].redText,
    },

    //

    buttonContainer: {
  flexDirection: 'row',
  marginTop: 8,
  gap: 8,
},
actionButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  flex: 1,
},
acceptButton: {
  backgroundColor: Colors[theme].primary,
},
rejectButton: {
  backgroundColor: Colors[theme].tabIconDefault,
},
buttonText: {
  color: Colors[theme].whiteText,
  textAlign: 'center',
  fontSize: 14,
},
acceptedText: {
  color: Colors[theme].primary,
  marginTop: 4,
  fontSize: 14,
},
rejectedText: {
  color: Colors[theme].tabIconDefault,
  marginTop: 4,
  fontSize: 14,
},
  });
