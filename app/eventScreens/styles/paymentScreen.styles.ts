import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: 'dark' | 'light') => StyleSheet.create({
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
  },
  label: {
    fontSize: FontSize.large,
    color: Colors[theme].blackText,
  },
  addCard: {},
  addCardText: {
    fontSize: FontSize.small,
    color: Colors[theme].redText,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginHorizontal: wp(2),
    marginTop: hp(3),
    borderWidth: 1,
    borderRadius: Borders.radius2,
    borderColor: Colors[theme].primary,
    backgroundColor: theme === 'light' ? 'rgba(118,202,187,0.2)' : Colors[theme].backgroundSecondary,
  },
  methodName: {
    fontSize: FontSize.medium,
    color: Colors[theme].blackText,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderRadius: Borders.radius2,
    borderColor: Colors[theme].primary,
    backgroundColor: theme === 'light' ? 'rgba(118,202,187,0.2)' : Colors[theme].backgroundSecondary,
  },
  cardText: {
    fontSize: FontSize.medium,
    color: Colors[theme].redText,
    marginLeft: wp(3),
  },
  voucherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: Borders.radius2,
    overflow: "hidden",
    backgroundColor: Colors[theme].background,
  },
  voucherInput: {
    flex: 1,
    padding: wp(3),
    fontSize: FontSize.small,
    color: Colors[theme].blackText,
  },
  applyButton: {
    backgroundColor: Colors[theme].greenText,
    paddingHorizontal: wp(17),
    paddingVertical: wp(3),
    borderRadius: Borders.radius1,
  },
  applyText: {
    color: Colors[theme].whiteText,
    fontWeight: "600",
  },
  checkoutText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.medium,
    fontWeight: "bold",
  },
  selectedRadio: {
    width: wp(5),
    height: wp(5),
    borderRadius: Borders.circle,
    borderWidth: 2,
    borderColor: Colors[theme].primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[theme].whiteText,
  },
  unselectedRadio: {
    width: wp(5),
    height: wp(5),
    borderRadius: Borders.circle,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[theme].whiteText,
  },
  radioDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: Borders.circle,
    backgroundColor: Colors[theme].primary,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  radioRowForPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    marginVertical: wp(4)
  },
  voucherSection: {
    marginTop: hp(2),
    marginBottom: hp(10)
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBackground: {
    backgroundColor: Colors[theme].pink,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    paddingVertical: hp(4),
    paddingHorizontal: wp(6),
  },
  inputlabel: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.medium,
    marginBottom: hp(0.5),
  },
  inputField: {
    backgroundColor: Colors[theme].pink,
    borderRadius: Borders.radius1,
    marginBottom: hp(2),
    color: Colors[theme].whiteText
  },
  inputInner: {
    borderWidth: 1,
    borderColor: Colors[theme].primary,
    borderRadius: Borders.radius1,
    height: hp(6.5),
    paddingHorizontal: wp(3),
    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : Colors[theme].backgroundSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  circleCheck: {
    width: wp(5),
    height: wp(5),
    borderRadius: Borders.circle,
    backgroundColor: Colors[theme].greenText,
    marginRight: wp(3),
  },
  saveLabel: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.small,
  },
  confirmBtn: {
    backgroundColor: Colors[theme].greenText,
    paddingVertical: hp(1),
    borderRadius: Borders.radius4,
    alignItems: 'center',
  },
  confirmText: {
    color: Colors[theme].whiteText,
    fontSize: FontSize.medium,
    fontWeight: '600',
  },
});