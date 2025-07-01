import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: 'light' | 'dark') => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors[theme].backgroundSecondary,
  },

  headerContainer: {
    flexDirection: "row",
    marginTop: hp(2),
    paddingVertical: hp(1),
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors[theme].whiteText,
    borderRadius: Borders.radius2,
    justifyContent: "center",
    paddingHorizontal: hp(2),
    marginLeft: wp(10),
  },
  profileContainer: {
    width: hp(5),
    height: hp(5),
    borderRadius: Borders.circle,
    backgroundColor: Colors[theme].primary,
    marginLeft: "auto",
    borderColor: Colors[theme].primary,
    borderWidth: 1,
  },
  notificationContainer: {
    width: hp(5),
    height: hp(5),
    borderRadius: Borders.circle,
    backgroundColor: Colors[theme].whiteText,
    marginLeft: wp(4),
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    width: "100%",
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  searchInput: {
    width: "100%",
    height: hp(7),
    backgroundColor: Colors[theme].whiteText,
    borderRadius: Borders.radius2,
    paddingHorizontal: wp(4),
    color: Colors[theme].blackText,
    borderWidth: 1,
    borderColor: Colors[theme].gray,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIconContainer: {
    position: "absolute",
    right: wp(4),
    top: hp(1.5),
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors[theme].pink,
    borderWidth: 1,
    borderRadius: Borders.circle,
    padding: wp(1),
    alignSelf: "center",
  },
  upcomingEventsContainer: {
    borderRadius: Borders.radius2,
  },
  upcomingEventsText: {
    fontSize: FontSize.large,
    color: Colors[theme].blackText,
    marginLeft: wp(2),
  },
  upcomingCardContainer: {
    paddingVertical: hp(2),
  },
  btnTxt: {
    fontSize: FontSize.small,
    color: Colors[theme].pink,
  },
  creatorShowCardContainer: {
    paddingVertical: wp(5),
  },
});