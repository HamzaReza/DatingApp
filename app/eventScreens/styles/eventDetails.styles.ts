import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme:'dark'|'light')=>StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  backgroundImageContainer: {
    width: wp(100),
    height: hp(35),
  },
  backgroundImage: {
    width: wp(100),
    height: hp(35),
    padding: wp(3),
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subheader: {
    flexDirection: 'row',
    gap: wp(3),
  },
  datePlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSize.large,
    color: Colors[theme].whiteText,
  },
  nameText: {
    fontSize: FontSize.extraLarge,
    color: Colors[theme].whiteText,
    fontWeight: '800',
    marginBottom: hp(2),
  },
  section: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  sectionTitle: {
    color: Colors[theme].pink,
    fontWeight: '600',
    fontSize: FontSize.large,
    marginBottom: wp(2),
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(3),
    gap: wp(2),
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.circle,
    marginRight: wp(3),
  },
  creatorName: {
    fontSize: FontSize.medium,
    fontWeight: '600',
  },
  likesText: {
    fontSize: FontSize.medium,
    color: Colors[theme].pink,
    fontWeight: '600',
  },
  aboutText: {
    marginTop: wp(1),
    fontSize: FontSize.small,
    color: Colors[theme].whiteText,
    lineHeight: wp(5),
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: Colors[theme].background,
    elevation:10
  },
  priceContainer: {
    borderWidth: 1.5,
    borderColor: Colors[theme].pink,
    borderRadius: Borders.radius1,
    paddingVertical: wp(5),
    paddingHorizontal: wp(6),
  },
  priceText: {
    color: Colors[theme].pink,
    fontWeight: 'bold',
    fontSize: FontSize.medium,
  },
  buyButton: {
    backgroundColor: Colors[theme].pink,
    paddingVertical: wp(5),
    paddingHorizontal: wp(20),
     borderRadius: Borders.radius1,
    
    borderWidth:1,
    borderColor:Colors[theme].pink
  },
  buyText: {
    color: Colors[theme].whiteText,
    fontWeight: 'bold',
    fontSize: FontSize.medium,
  },
});