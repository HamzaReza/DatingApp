import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    flex: 1,
  },
  ticketTypeHeader: {
    fontWeight: '600',
    fontSize: FontSize.large,
    marginTop: wp(6),
    marginBottom: wp(2),
    color: Colors.light.blackText,
    
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: Borders.radius2,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:wp(2),
    
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
  backgroundColor: Colors.light.primary,
},
  tabText: {
    color: Colors.light.redText,
    fontWeight: 'bold',
    fontSize: FontSize.small,
  },
  tabTextActive: {
    color: Colors.light.whiteText,
  },
  seatSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(118,202,187,0.4)', 
    borderRadius: Borders.radius2,
    padding: wp(3),
    width:wp(92),
    alignSelf:'center'
  },
  seatSelectorLabel: {
    fontWeight: 'bold',
    fontSize: FontSize.small,
    color: Colors.light.primary,
    
  },
 seatSelectorControls: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%' 
},
  seatButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.radius2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:Colors.light.pink,
    borderWidth:0.5
    
    
  },
  seatButtonText: {
    color: Colors.light.pink,
    
    fontSize: FontSize.large,
  },
  seatCount: {

    fontSize: FontSize.large,
    color: Colors.light.pink,
    minWidth: wp(6),
    textAlign: 'center',
  },
  singlePriceContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  mutiplyText:{
    width:'100%',
    textAlign:'right'
  },
  horizontaLine:{
    height:2,
    backgroundColor:Colors.light.gray,
    width:'100%',
    marginVertical:hp(3)
  },
  totalPrice:{
    color:Colors.light.pink,
 fontSize:FontSize.small,
 fontWeight:'700'
  },
  buttonContainer:{
    width:wp(50),
    alignSelf:'center',
    marginTop:hp(20)
  }
});