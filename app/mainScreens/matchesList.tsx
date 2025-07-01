import RnText from '@/components/RnText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';
import createStyles from '../../app/mainScreens/styles/matchList.styles';

export default function MatchConfirmation() {

const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const handleBookEvent = () => {
    console.log('Book event pressed');
  };

  const handleMessage = () => {
    router.push('/messages');
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Background Images */}
   <View style={styles.backgroundImages}>
  {/* Left image at bottom left */}
  <View style={styles.leftImageContainer}>
    <Image 
      source={{ uri: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
      style={styles.backgroundImage} 
    />
    <View style={styles.leftHeartBadge}>
      <Ionicons name="heart" size={25} color={Colors[theme].pink} />
    </View>
  </View>
  
  {/* Right image at top left */}
  <View style={styles.rightImageContainer}>
    <Image 
      source={{ uri: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
      style={styles.backgroundImage} 
    />
    <View style={styles.rightHeartBadge}>
      <Ionicons name="heart" size={25} color={Colors.[theme].pink} />
    </View>
  </View>
</View>

      {/* Content */}
      <View style={styles.content}>
        <RnText style={styles.title}>It's a match, Jake!</RnText>
        <RnText style={styles.subtitle}>
          Start a conversation now with each other
        </RnText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookEvent}>
            <RnText style={styles.bookButtonText}>Book Event</RnText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <RnText style={styles.messageButtonText}>Message</RnText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Close Button */}
    
    </View>
  );
}

