import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = hp(60);
const HEADER_HEIGHT = hp(8);
 
 export default StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: Colors.light.background,
   },
   header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingHorizontal: wp(4),
     paddingTop: hp(6),
     paddingBottom: hp(2),
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     zIndex: 20,
     backgroundColor: 'transparent',
   },
   headerButton: {
     width: wp(12),
     height: wp(12),
     borderRadius: wp(6),
     backgroundColor: 'rgba(255,255,255,0.9)',
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   imageContainer: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     height: IMAGE_HEIGHT,
     zIndex: 1,
   },
   mainImage: {
     width: '100%',
     height: '100%',
     borderBottomLeftRadius: wp(6),
     borderBottomRightRadius: wp(6),
   },
   floatingActionButtons: {
     position: 'absolute',
     top: hp(47),
     left: 0,
     right: 0,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     gap: wp(6),
     zIndex: 15,
   
   },
   actionButton: {
     width: wp(16),
     height: wp(16),
     borderRadius: wp(8),
     backgroundColor: 'rgba(255,255,255,0.95)',
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.15,
     shadowRadius: 8,
     elevation: 8,
   },
   likeButton: {
     backgroundColor: Colors.light.redText,
     width: wp(20),
     height: wp(20),
     borderRadius: wp(10),
   },
   scrollView: {
     flex: 1,
     zIndex: 10,
    
   },
   
   imageSpacer: {
     height: IMAGE_HEIGHT - hp(8),
   },
   contentContainer: {
     backgroundColor: Colors.light.background,
     borderTopLeftRadius: wp(6),
     borderTopRightRadius: wp(6),
     paddingTop: hp(6),
     minHeight: SCREEN_HEIGHT - IMAGE_HEIGHT + hp(8),
     shadowColor: '#000',
     shadowOffset: { width: 0, height: -2 },
     shadowOpacity: 0.1,
     shadowRadius: 8,
     elevation: 5,
     paddingHorizontal:wp(4)
   },
   profileInfo: {
     paddingHorizontal: wp(4),
     marginBottom: hp(2),
     flexDirection:'row',
     justifyContent:'space-between'
   },
   nameContainer: {
    
     justifyContent: 'space-between',
   
     marginBottom: hp(0.5),
   },
   name: {
     fontSize: FontSize.extraLarge,
     fontWeight: 'bold',
     color: Colors.light.blackText,
   },
   sendButton: {
     padding: wp(2),
   },
   profession: {
     fontSize: FontSize.small,
     color: Colors.light.blackText,
   },
   section: {
     paddingHorizontal: wp(4),
     marginBottom: hp(3),
   },
   sectionTitle: {
     fontSize: FontSize.large,
     fontWeight: 'bold',
     color: Colors.light.blackText,
     marginBottom: hp(1),
   },
   bio: {
     fontSize: FontSize.small,
     color: Colors.light.blackText,
     lineHeight: 24,
   },
   locationContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: hp(0.5),
   },
   distance: {
     fontSize: FontSize.regular,
     color: Colors.light.redText,
     marginLeft: wp(1),
   },
   location: {
    fontSize: FontSize.small,
     color: Colors.light.blackText,
   },
   about: {
  fontSize: FontSize.small,
     color: Colors.light.blackText,
     lineHeight: 24,
     marginBottom: hp(1),
   },
   readMore: {
    fontSize: FontSize.small,
     color: Colors.light.redText,
     fontWeight: '600',
   },
   interestsContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: wp(2),
   },
   galleryHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: hp(2),
   },
   seeAll: {
    fontSize: FontSize.small,
     color: Colors.light.redText,
     fontWeight: '600',
   },
   gallery: {
     gap: wp(2),
   },
   galleryRow: {
     flexDirection: 'row',
     gap: wp(2),
     marginBottom: wp(2),
   },
   largeGalleryItem: {
     flex: 1,
     height: hp(25),
     borderRadius: wp(3),
     overflow: 'hidden',
     position: 'relative',
   },
   smallGalleryItem: {
     flex: 1,
     height: hp(12),
     borderRadius: wp(3),
     overflow: 'hidden',
   },
   galleryImage: {
     width: '100%',
     height: '100%',
   },
   playButton: {
     position: 'absolute',
     top: wp(2),
     left: wp(2),
     width: wp(8),
     height: wp(8),
     borderRadius: wp(4),
     backgroundColor: Colors.light.redText,
     justifyContent: 'center',
     alignItems: 'center',
   },

   //modal
   modalBackground: {
    height:hp(100),
    backgroundColor: Colors.light.whiteText,
    justifyContent: "center",
    // alignItems: "center",
  },
  closeButton: {
    
   
    backgroundColor: Colors.light.whiteText,
    borderRadius: Borders.radius1,
    width: wp(10),
    height: wp(10),
    borderWidth: 1,
    borderColor: Colors.light.gray,
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    alignItems:'center',
    justifyContent :'center'
   
  },
  modalImageContainer: {
   
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
    backgroundColor: Colors.light.whiteText,
    height:hp(70),
    marginBottom: hp(2),
    alignSelf: "center",
    
  },
  modalMainImage: {
    width: wp(100),
    height: hp(100),
    borderRadius: wp(4),
  },
  thumbnailList: {
    // paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignItems: "center",
    height: hp(20),
    justifyContent: "center",

  },
  thumbnail: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: hp(2),
  },
  selectedThumbnail: {
    borderColor: Colors.light.pink,
  },
})