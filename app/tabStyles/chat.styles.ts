import { Borders } from "@/constants/Borders"
import { Colors } from "@/constants/Colors"
import { FontSize } from "@/constants/FontSize"
import { hp, wp } from "@/utils"
import { StyleSheet } from "react-native"

 export default (theme:'dark'|'light')=>StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: "transparent",
     },
   
     modalContainer: {
       height: hp(87), // Set height to 85% of the screen
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
     dragHandle: {
       width: wp(12),
       height: hp(0.6),
       backgroundColor: "#E0E0E0",
       borderRadius: wp(1),
     },
     userInfo: {
       flexDirection: "row",
       alignItems: "center",
       flex: 1,
   
       paddingHorizontal: wp(6),
     },
     avatarContainer: {
       position: "relative",
       marginRight: wp(3),
     },
     userAvatar: {
       width: wp(12),
       height: wp(12),
       borderRadius: wp(6),
     },
     avatarBorder: {
       position: "absolute",
       top: -2,
       left: -2,
       right: -2,
       bottom: -2,
       borderRadius: wp(7),
       borderWidth: 2,
       borderColor: Colors[theme].redText,
     },
     userDetails: {
       flex: 1,
     },
     userName: {
       fontSize: FontSize.small,
       fontWeight: "600",
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
       borderRadius: wp(4),
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
       borderRadius: wp(5),
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
       paddingTop: hp(6),
       paddingBottom: hp(2),
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
 })
 
 
  