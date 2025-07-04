import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/FontFamily';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { StyleSheet } from 'react-native';

export default (theme:'dark'|'light')=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  backgroundImages: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: wp(8),
    paddingTop: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(50),
    
  },
  leftImageContainer: {
    position: 'relative',
    transform: [{ rotate: '-5deg' }],
    marginTop: hp(8),
    zIndex: 1,
    marginLeft: wp(20),
    left: 20,
  },
  rightImageContainer: {
    position: 'relative',
    transform: [{ rotate: '8deg' }],
    marginBottom: hp(20),
    marginRight: wp(20),
    right: 20,
  },
  backgroundImage: {
    width: wp(40),
    height: wp(65),
    borderRadius: Borders.radius2,
  },
 leftHeartBadge: {
  position: 'absolute',
  bottom: -wp(2),
  left: -wp(2),
  width: wp(12),
  height: wp(12),
  borderRadius: Borders.circle,
  backgroundColor: Colors[theme].whiteText,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: Colors[theme].whiteText,
  elevation: 5,
},
rightHeartBadge: {
  position: 'absolute',
  top: -wp(2),
  left: -wp(2),
  width: wp(12),
  height: wp(12),
  borderRadius: Borders.circle,
  backgroundColor: Colors[theme].whiteText,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: Colors[theme].whiteText,
  elevation: 5,
},
  content: {
    paddingHorizontal: wp(8),
    paddingBottom: hp(12),
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.extraLarge,
   fontFamily:FontFamily.bold,
    color: Colors[theme].pink,
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: FontSize.medium,
    color: Colors[theme].tabIconDefault,
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: 20,
    
  },
  buttonContainer: {
  height: hp(12),
    width: '100%',
    gap: hp(2),
  },
  bookButton: {
    backgroundColor: Colors[theme].pink,
    paddingVertical: hp(1.6),
    borderRadius: Borders.radius2,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.large,
    fontFamily:FontFamily.semiBold,
  },
  messageButton: {
    backgroundColor: 'rgba(255,88,98,0.15)',
   paddingVertical: hp(1.6),
    borderRadius: Borders.radius2,
    alignItems: 'center',
   
  },
  messageButtonText: {
    color: Colors[theme].pink,
    fontSize: FontSize.large,
     fontFamily:FontFamily.semiBold,
  },
  closeButton: {
    position: 'absolute',
    top: hp(6),
    right: wp(6),
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.radius2,
    backgroundColor: Colors[theme].gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});