import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: 'dark' | 'light') => StyleSheet.create({
  ticketCardWrapper: {
    marginTop: hp(4),
    alignItems: 'center',
  },
  ticketCard: {
    backgroundColor: Colors[theme].primary,
    borderRadius: Borders.radius2,
    width: wp(90),
    padding: wp(5),
  },
  ticketTopSection: {
    backgroundColor: Colors[theme].background,
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    padding: wp(4),
  },
  ticketBottomSection: {
    borderTopWidth: 1,
    borderColor: Colors[theme].blackText,
    padding: wp(4),
    alignItems: 'center',
    backgroundColor: Colors[theme].background,
    borderBottomLeftRadius: Borders.radius2,
    borderBottomRightRadius: Borders.radius2,
  },
  eventTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: Colors[theme].blackText,
    marginBottom: hp(2),
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: FontSize.small,
    color: Colors[theme].blackText,
    fontWeight: '600',
  },
  value: {
    fontSize: FontSize.small,
    color: Colors[theme].blackText,
    marginTop: hp(0.5),
  },
  qr: {
    width: wp(30),
    height: wp(30),
  },
  downloadBtn: {
    marginTop: hp(6),
    alignSelf: 'center',
    backgroundColor: Colors[theme].redText,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: Borders.radius4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: FontSize.medium,
    color: Colors[theme].whiteText,
    fontWeight: '600',
  },
});