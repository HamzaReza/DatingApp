import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default (theme: "light" | "dark") =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: hp(2),
    },
    title: {
      fontSize: FontSize.extraLarge,
      fontFamily: FontFamily.bold,
      color: Colors[theme].greenText,
    },
    headerActions: {
      flexDirection: "row",
    },
    actionButton: {
      marginLeft: wp(3),
    },
    section: {
      marginBottom: hp(2),
    },
    usersList: {
      paddingLeft: wp(2),
    },
    sectionTitle: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].greenText,
      marginBottom: hp(1),
    },
    hugText: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.bold,
      color: Colors[theme].redText,
      marginBottom: hp(2),
    },
    sectionSubtitle: {
      fontSize: FontSize.regular,
      color: Colors[theme].blackText,
      marginBottom: hp(2),
    },
    interestsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    connectButton: {
      backgroundColor: Colors[theme].redText,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
      borderTopRightRadius: Borders.circle,
      borderBottomRightRadius: Borders.circle,
      alignSelf: "flex-start",
      marginBottom: hp(2),
    },
    connectText: {
      color: Colors[theme].background,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
    },
    mapContainer: {
      height: hp(25),
      backgroundColor: Colors[theme].greenText,
      borderRadius: Borders.radius2,
      position: "relative",
      overflow: "hidden",
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    mapText: {
      color: Colors[theme].greenText,
      marginTop: hp(1),
    },
    userPins: {
      ...StyleSheet.absoluteFillObject,
    },
    userPin: {
      position: "absolute",
      width: wp(8),
      height: wp(8),
    },
    pinImage: {
      width: "100%",
      height: "100%",
      borderRadius: Borders.radius2,
      backgroundColor: Colors[theme].redText,
      justifyContent: "center",
      alignItems: "center",
    },
    subHeadContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    viewAllText: {
      color: Colors[theme].greenText,
    },
    filterModalContainer: {
      backgroundColor: Colors[theme].background,
      borderRadius: Borders.radius2,
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },
    applyFilterButton: {
      backgroundColor: Colors[theme].redText,
      borderRadius: Borders.circle,
      width: wp(80),
      alignItems: "center",
      justifyContent: "center",
      marginVertical: hp(2),
    },
    filterHeaderText: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].redText,
      textAlign: "center",
      marginBottom: hp(2),
    },
    filterHeaderSubText: {
      color: Colors[theme].redText,
      textAlign: "center",
      marginBottom: hp(4),
    },
    filterSlider: {
      marginVertical: hp(1),
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalOptionText: {
      fontFamily: FontFamily.semiBold,
    },
    filterInput: {
      marginVertical: hp(1),
    },
    locationDropdown: {
      width: wp(30),
      paddingHorizontal: wp(2),
      height: hp(5),
    },
    locationDropdownText: {
      fontSize: FontSize.extraSmall,
    },
    map: {
      height: hp(25),
      borderRadius: Borders.radius2,
    },
    getLocationContainer: {
      height: hp(20),
      borderRadius: Borders.radius2,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors[theme].primaryOpaque,
    },
    getLocationButton: {
      width: wp(50),
      height: hp(4),
    },
    getLocationButtonText: {
      fontSize: FontSize.extraSmall,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].redText,
    },
  });
