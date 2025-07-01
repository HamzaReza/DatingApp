import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme:'dark'|'light')=>StyleSheet.create({
  headerContainer: {
    width: wp(100),
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
    marginBottom: hp(2),
    alignSelf:'center'
  },
  iconContainer: {
    position: 'absolute',
    left: wp(4),
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: wp(10),
  },
  iconsContainer: {
    position: 'absolute',
    right: wp(4),
    top: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    width: wp(18),
    justifyContent: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
     marginVertical: hp(2),
     backgroundColor:Colors[theme].backgroundSecondary

  },
  titleText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: FontSize.large,
    color:Colors[theme].primary
  },
  detailsContainer:{
    alignSelf:'center',
    marginHorizontal:wp(2),
    width:wp(100)
  }
});