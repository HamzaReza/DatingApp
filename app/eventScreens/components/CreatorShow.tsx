import RnText from '@/components/RnText'
import { Borders } from '@/constants/Borders'
import { Colors } from '@/constants/Colors'
import { FontSize } from '@/constants/FontSize'
import { hp, wp } from '@/utils'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'


type CreatorShowProps ={
  showDate:string;
  showName:string;
  showTitle:string;
  backgroundImage:string;
}

const CreatorShow = ({showDate,showName,showTitle,backgroundImage}:CreatorShowProps) => {
  return (
   <View style={styles.imageBackgroundContainer}>
    <ImageBackground
      style={styles.imageBackground}
      imageStyle={styles.imageBackground} 
      source={{uri: backgroundImage}}
    >
      <View style={styles.contentPadding}>
        <RnText style={styles.titleText}>{showName}</RnText>
        <RnText style={styles.nameText}>{showTitle}</RnText>
        <RnText style={styles.dateText}>{showDate}</RnText>
      </View>
    </ImageBackground>
   </View>
  )
}

export default CreatorShow

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: wp(37),
    height: hp(24),
    borderRadius: Borders.radius3,
    overflow: 'hidden',
    marginRight:wp(5)
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    borderRadius: Borders.radius3,
  },
  contentPadding: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'flex-end',
    alignItems:'center'
  },

  titleText:{
    color:Colors.light.whiteText,
    fontWeight:'bold',
    fontSize:FontSize.large
  },

  nameText:{
    color:Colors.light.whiteText,
    fontSize:FontSize.small
  },
  dateText:{
    color:Colors.light.whiteText,
    fontSize:FontSize.extraSmall
  }
})