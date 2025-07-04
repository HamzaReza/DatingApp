import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/FontFamily';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { StyleSheet } from 'react-native';

export default (theme:'dark'|'light') =>StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].primary,
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
   fontFamily:FontFamily.semiBold,
    color: Colors[theme].whiteText,
  },
  createGroupButton: {
    backgroundColor: Colors[theme].pink,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.3),
    borderRadius: Borders.radius3,
    alignItems:'center',
    justifyContent:'center'
  },
  createGroupText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.small,
   fontFamily:FontFamily.semiBold,
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
    borderRadius:Borders.radius2,
  },
  likesOverlay: {
    
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,88,98,0.4)", 
  borderRadius: Borders.radius2,
  justifyContent: "center",
  alignItems: "center",
  
},
likesText: {
  color: Colors[theme].whiteText,
  fontSize: FontSize.regular,
fontFamily:FontFamily.semiBold,
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
    paddingBottom: hp(2),
   height: hp(35),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    paddingBottom: hp(2),
  },
});