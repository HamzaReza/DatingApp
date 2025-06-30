import RnText from '@/components/RnText'
import { Borders } from '@/constants/Borders'
import { Colors } from '@/constants/Colors'
import { FontSize } from '@/constants/FontSize'
import { hp, wp } from '@/utils'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'



const EventButton = ({onPress,title='continue'}) => {
  return (
   <TouchableOpacity style={{
width:wp(50),
height:hp(5),
borderRadius:Borders.radius3,
justifyContent:'center',
alignItems:'center',
alignSelf:'center',
backgroundColor:Colors.light.pink
   }}
   onPress={onPress}
   >
<RnText style={{
    textAlign:'center',
    color:Colors.light.whiteText,
    fontWeight:'600',
    fontSize:FontSize.small
}}>{title}</RnText>
   </TouchableOpacity>
  )
}

export default EventButton

const styles = StyleSheet.create({})