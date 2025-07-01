import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { hp } from '@/utils';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type Props = {
  image: string;
  username: string;
  isOwn: boolean;
  onPress?: () => void;
};

const StoryCircle: React.FC<Props> = ({ image, username, isOwn, onPress }) => {


const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={[styles.container,{marginLeft:isOwn?0:hp(1.5)}]} onPress={onPress}>
      <View style={[styles.imageWrapper, isOwn && styles.ownStoryBorder]}>
        <Image source={{ uri: image }} style={styles.image} />
        {isOwn && (
          <View style={styles.plusIcon}>
            <AntDesign name="pluscircle" size={20} color={Colors[theme].greenText} />
          </View>
        )}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {username}
      </Text>
    </TouchableOpacity>
  );
};
const createStyles  = (theme:'dark'|'light')=>StyleSheet.create({
  container: {
    alignItems: 'center',
    width: hp(8), 
    
  },
  imageWrapper: {
    padding: hp(0.2),            
    borderRadius: hp(5),         
    borderWidth: hp(0.25),      
    borderColor: Colors[theme].greenText,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ownStoryBorder: {
    borderColor: '#ccc',
  },
  image: {
    width: hp(7),                
    height: hp(7),
    borderRadius: hp(4),
  },
  plusIcon: {
    position: 'absolute',
    bottom: -hp(0.5),            
    right: -hp(0.5),             
  },
  username: {
    marginTop: hp(0.8),
    fontSize:FontSize.regular,
    textAlign: 'center',
    color: Colors[theme].redText,
  },
});


export default StoryCircle;
