import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme:'dark'|'light')=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].backgroundSecondary,

  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    marginTop: wp(7),
    color: Colors[theme].blackText,
    marginBottom:wp(5)
  },
  card: {
    width: wp(80),
    height: hp(20),
    backgroundColor: Colors[theme].pink,
    borderRadius: Borders.radius2,
    padding: wp(5),
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: wp(5),
    marginLeft:wp(5)
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardName: {
    color: Colors[theme].background,
    fontSize: FontSize.large,
    fontWeight: '600',
  },
  cardChip: {
    width: wp(6),
    height: wp(6),
    borderRadius:Borders.circle,
    backgroundColor: Colors[theme].background,
  },
  cardNumber: {
    marginTop: wp(8),
    fontSize: FontSize.large,
    fontWeight: '600',
    color: Colors[theme].blackText,
  },
  cardExp: {
    marginTop: wp(2),
    fontSize: FontSize.small,
    color: Colors[theme].blackText,
  },
  confirmButton: {
    position: 'absolute',
    bottom: hp(3),
    alignSelf: 'center',
    backgroundColor: '#FF5E6C',
    paddingVertical: wp(3.5),
    paddingHorizontal: wp(30),
    borderRadius: Borders.radius3,
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
    fontSize:FontSize.small,
  },
  decorCircle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: '#CCF',
    borderRadius: 20,
    opacity: 0.3,
  },
  decorArrow: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 20,
    backgroundColor: '#B0B',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
});