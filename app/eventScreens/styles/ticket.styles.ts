import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  ticketCardWrapper: {
    marginTop: hp(4),
    alignItems: 'center',
  },
  ticketCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: Borders.radius2,
    width: wp(90),
    padding: wp(5),
  },
  ticketTopSection: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    padding: wp(4),
  },
  ticketBottomSection: {
    borderTopWidth: 1,
    borderColor: Colors.light.blackText,
    padding: wp(4),
    alignItems: 'center',
    backgroundColor:Colors.light.background,
borderBottomLeftRadius:Borders.radius2,
borderBottomRightRadius:Borders.radius2
  },
  eventTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: Colors.light.blackText,
    marginBottom: hp(2),
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: FontSize.small,
    color: Colors.light.blackText,
    fontWeight: '600',
  },
  value: {
    fontSize: FontSize.small,
    color: Colors.light.blackText,
    marginTop: hp(0.5),
  },
  qr: {
    width: wp(30),
    height: wp(30),
  },
  downloadBtn: {
    marginTop: hp(6),
    alignSelf: 'center',
    backgroundColor: Colors.light.redText,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: Borders.radius4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: FontSize.medium,
    color: Colors.light.whiteText,
    fontWeight: '600',
  },
});