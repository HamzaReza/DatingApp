import { Borders } from "@/constants/Borders";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
   mainContainer: {
       flex: 1,
       backgroundColor: Colors.light.backgroundSecondary,
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
       backgroundColor: Colors.light.whiteText,
       borderRadius: Borders.radius2,
       justifyContent: "center",
       paddingHorizontal: hp(2),
       marginLeft: wp(10),
     },
     profileContainer: {
       width: hp(5),
       height: hp(5),
       borderRadius: Borders.circle,
       backgroundColor: Colors.light.primary,
       marginLeft: "auto",
       borderColor: Colors.light.primary,
       borderWidth: 1,
     },
     notificationContainer: {
       width: hp(5),
       height: hp(5),
       borderRadius: Borders.circle,
       backgroundColor: Colors.light.whiteText,
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
       backgroundColor: Colors.light.whiteText,
       borderRadius: Borders.radius2,
       paddingHorizontal: wp(4),
       color: Colors.light.blackText,
       borderWidth: 1,
       borderColor: Colors.light.gray,
       alignItems: "center",
       justifyContent: "center",
     },
     searchIconContainer: {
       position: "absolute",
       right: wp(4),
       top: hp(1.5),
       justifyContent: "center",
       alignItems: "center",
       borderColor: Colors.light.pink,
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
       color: Colors.light.blackText,
       marginLeft: wp(2),
     },
     upcomingCardContainer: {
       paddingVertical: hp(2),
     },
     btnTxt: {
       fontSize: FontSize.small,
       color: Colors.light.pink,
     },
     creatorShowCardContainer:{
       paddingVertical:wp(5)
     } 
})