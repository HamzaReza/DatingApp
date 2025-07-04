import { Borders } from "@/constants/Borders";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default (theme:'dark'|'light')=>StyleSheet.create({
  container: {
    backgroundColor: Colors[theme].backgroundSecondary,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: hp(4),
  },
  instruction: {
    color: Colors[theme].blackText,
    fontSize: FontSize.medium,
    marginBottom: hp(4),
    paddingHorizontal: wp(4),


  },
  frame: {
    width: wp(80),
    height: hp(25),
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: wp(10),
    height: wp(10),
    borderColor: Colors[theme].redText,
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(5),
    alignSelf: 'center',
  },
  scanButton: {
    backgroundColor: Colors[theme].redText,
    borderRadius: Borders.radius4,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
  },
  buttonText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.medium,
 fontFamily:FontFamily.semiBold,
  },
});
