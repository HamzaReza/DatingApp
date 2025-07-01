import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme:'dark'|'light')=>StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors[theme].primary,
      },
      header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: hp(4),
        paddingLeft: wp(2),
      },
      content: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: wp(6),
        paddingTop: hp(4),
      },
      connectionText: {
        fontSize: FontSize.extraLarge,
        fontWeight: "bold",
        color: Colors[theme].whiteText,
        textAlign: "center",
        marginBottom: hp(1),
        width: wp(100),
      },
      nameText: {
        color: Colors[theme].pink,
        fontWeight: "bold",
        fontSize: FontSize.extraLarge,
      },
      timeText: {
        fontSize: FontSize.small,
        color: Colors[theme].whiteText,
        opacity: 0.8,
        marginBottom: hp(4),
      },
      profileContainer: {
        alignItems: "center",
        marginBottom: hp(4),
      },
      profileImageContainer: {
        position: "relative",
      },
      profileImage: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(16),
      },
      profileBorder: {
        position: "absolute",
        top: -wp(2),
        left: -wp(2),
        right: -wp(2),
        bottom: -wp(2),
        borderRadius: wp(18),
        borderWidth: 3,
        borderColor: Colors[theme].pink,
      },
      readReceiptTitle: {
        fontSize: FontSize.large,
        color: Colors[theme].whiteText,
        textAlign: "center",
        marginBottom: hp(3),
        lineHeight: 26,
      },
      readReceiptButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors[theme].pink,
        paddingHorizontal: wp(6),
        paddingVertical: hp(0.7),
        borderRadius: wp(6),
        marginBottom: hp(4),
      },
      readReceiptButtonText: {
        color: Colors[theme].whiteText,
        fontSize: FontSize.small,
        fontWeight: "bold",
        marginLeft: wp(2),
      },
      decorativeCircles: {
        position: "absolute",
        bottom: hp(10),
        left: 0,
        right: 0,
        height: hp(20),
        zIndex: 1,
      },
    
      bottomContainer: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(4),
        alignItems: "center",
      },
})