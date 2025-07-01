import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: 'dark' | 'light') => StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors[theme].backgroundSecondary,
    flex: 1,
  },
  ticketTypeHeader: {
    fontWeight: '600',
    fontSize: FontSize.large,
    marginTop: wp(6),
    marginBottom: wp(2),
    color: Colors[theme].blackText,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors[theme].backgroundSecondary,
    borderRadius: Borders.radius2,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp(2),
  },
  tabButton: {
    paddingVertical: wp(1),
    height: hp(6),
    borderRadius: Borders.radius2,
    backgroundColor: 'rgba(118,202,187,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  vipButton: {
    width: wp(30),
  },
  economyButton: {
    width: wp(45),
  },
  tabButtonActive: {
    backgroundColor: Colors[theme].primary,
  },
  tabText: {
    color: Colors[theme].redText,
    fontWeight: 'bold',
    fontSize: FontSize.small,
  },
  tabTextActive: {
    color: Colors[theme].whiteText,
  },
  seatSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(118,202,187,0.4)',
    borderRadius: Borders.radius2,
    padding: wp(3),
    width: wp(92),
    alignSelf: 'center',
  },
  seatSelectorLabel: {
    fontWeight: 'bold',
    fontSize: FontSize.small,
    color: Colors[theme].primary,
  },
  seatSelectorControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  seatButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.radius2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors[theme].pink,
    borderWidth: 0.5,
  },
  seatButtonText: {
    color: Colors[theme].pink,
    fontSize: FontSize.large,
  },
  seatCount: {
    fontSize: FontSize.large,
    color: Colors[theme].pink,
    minWidth: wp(6),
    textAlign: 'center',
  },
  singlePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mutiplyText: {
    width: '100%',
    textAlign: 'right',
  },
  horizontaLine: {
    height: 2,
    backgroundColor: Colors[theme].gray,
    width: '100%',
    marginVertical: hp(3),
  },
  totalPrice: {
    color: Colors[theme].pink,
    fontSize: FontSize.small,
    fontWeight: '700',
  },
  buttonContainer: {
    width: wp(50),
    alignSelf: 'center',
    marginTop: hp(20),
  },
});