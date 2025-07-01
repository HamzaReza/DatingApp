import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

 export default (theme:'dark'|'light')=>StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 1,
    backgroundColor: Colors[theme].background,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineContainer: {
    flexDirection: "row",
    position: "absolute",
    top: hp(6),
    left: wp(4),
    right: wp(4),
    width: "92%",
    zIndex: 2,
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
    position: "absolute",
    left: 0,
    top: 0,
  },
  profileContainer: {
    position: "absolute",
    top: hp(10),

    alignItems: "center",
    zIndex: 3,
    width: "100%",
    flexDirection:'row',
    paddingHorizontal: wp(4),
  },
  profileImage: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(8),
   
  },
  profileName: {
    color: Colors[theme].blackText,
    fontWeight: "bold",
    fontSize: FontSize.small,
    textAlign: "center",
    marginLeft: wp(2),
  },
  closeButton: {
    position: "absolute",
    top: hp(6),
    right: wp(4),
    zIndex: 3,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },
  storyTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  inputWrapper: {
    position: "absolute",
    bottom: hp(2.5),
    left: 0,
    right: 0,
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
   height: hp(6),
   
  },
  sendButton: {
marginBottom: hp(5),
height: hp(6),
    width: hp(6),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Borders.radius2,
    borderColor: Colors[theme].gray,
    borderWidth: 1,
  },
});