import RnText from '@/components/RnText'
import { Borders } from '@/constants/Borders'
import { Colors } from '@/constants/Colors'
import { FontSize } from '@/constants/FontSize'
import { hp, wp } from '@/utils'
import React from 'react'
import { ImageBackground, StyleSheet, View, useColorScheme } from 'react-native'

type CreatorShowProps ={
  showDate:string;
  showName:string;
  showTitle:string;
  backgroundImage:string;
}

const CreatorShow = ({showDate,showName,showTitle,backgroundImage}:CreatorShowProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedStyles = styles(theme);

  return (
   <View style={themedStyles.imageBackgroundContainer}>
    <ImageBackground
      style={themedStyles.imageBackground}
      imageStyle={themedStyles.imageBackground} 
      source={{uri: backgroundImage}}
    >
      <View style={themedStyles.contentPadding}>
        <RnText style={themedStyles.titleText}>{showName}</RnText>
        <RnText style={themedStyles.nameText}>{showTitle}</RnText>
        <RnText style={themedStyles.dateText}>{showDate}</RnText>
      </View>
    </ImageBackground>
   </View>
  )
}

export default CreatorShow

const styles = (theme: 'dark' | 'light') => StyleSheet.create({
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
    color: Colors[theme].whiteText,
    fontWeight:'bold',
    fontSize:FontSize.large
  },
  nameText:{
    color: Colors[theme].whiteText,
    fontSize:FontSize.small
  },
  dateText:{
    color: Colors[theme].whiteText,
    fontSize:FontSize.extraSmall
  }
});