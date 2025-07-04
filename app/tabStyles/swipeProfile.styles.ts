import { Borders } from "@/constants/Borders";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default (theme:'light'| 'dark') =>StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
    padding:0,
    paddingVertical:0,
    paddingHorizontal:0
  },
  backgroundImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    backgroundColor: 'rgba(255,179,186,0.9)',
    borderRadius: Borders.radius2,
    marginHorizontal: wp(20),
    marginTop: hp(2),
    alignSelf:'center',
    gap:wp(10)
  },
  topBarButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: Borders.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    position: 'absolute',
    bottom: hp(18),
    left: wp(6),
    right: wp(6),
  },
  nameText: {
    fontSize: FontSize.extraLarge,
    fontFamily:FontFamily.bold,
    color: Colors[theme].whiteText,
    marginBottom: hp(0.5),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  professionText: {
    fontSize: FontSize.large,
    color: Colors[theme].whiteText,
    marginBottom: hp(2),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagsContainer: {
    gap: hp(1),
    alignItems:'center',
    zIndex:1
  },
  tagRow: {
    flexDirection: 'row',
    gap: wp(3),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: Borders.radius4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(10px)',
    borderColor:Colors[theme].whiteText,
    borderWidth:0.5
  },

  distanceText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  privateText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  activeText: {
    color: Colors[theme].whiteText,
     fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  practicingText: {
    color: Colors[theme].whiteText,
  fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  flagText: {
    fontSize: FontSize.small,
  },
  countryText: {
    color: Colors[theme].whiteText,
     fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  matchText: {
    color: Colors[theme].whiteText,
   fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  trustText: {
    color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  actionButtons: {
    position: 'absolute',
    bottom: hp(11),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
    zIndex:1
  },
  actionButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: Borders.circle,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshButton: {
    backgroundColor: Colors[theme].pink,
  },
  dislikeButton: {
    backgroundColor: Colors[theme].pink,
  },
  likeButton: {
    backgroundColor: Colors[theme].pink,
  },
  superLikeButton: {
    backgroundColor: Colors[theme].pink,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    right: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: hp(2),
    borderRadius: wp(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: Colors[theme].primary,
  },
  gradientOverlay: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: hp(55), // adjust as needed for your design
  zIndex: 1,
},
});