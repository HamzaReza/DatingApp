import createStyles from '@/app/tabStyles/swipeProfile.styles';
import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, useColorScheme, View } from 'react-native';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const profileData = {
  name: 'Jenny L',
  age: 32,
  profession: 'profession',
  distance: '3km away',
  isPrivatePhotos: true,
  isActiveToday: true,
  isPracticing: true,
  country: 'USA',
  matchPercentage: 90,
  trustScore: 'Trust score',
  image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export default function SwipeProfile() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBackPress = () => {
    router.back();
  };

  const handleRefreshPress = () => {
    console.log('Refresh pressed');
  };

  const handleLikePress = () => {
    console.log('Like pressed');
  };

  const handleDislikePress = () => {
    console.log('Dislike pressed');
  };

  const handleHeartPress = () => {
    console.log('Heart pressed');
  };

  const handleSuperLikePress = () => {
    console.log('Super like pressed');
  };

  const handleTabPress = (tabName: string) => {
    console.log(`${tabName} tab pressed`);
  };


 const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <Container customStyle={styles.container}>

      {/* Background Image */}
      <Image source={{ uri: profileData.image }} style={styles.backgroundImage} />

 <LinearGradient
    colors={[
      'rgba(118,202,187,0.8)',
      'rgba(118,202,187,0.5)',
      'rgba(118,202,187,0)',
    ]}
    style={styles.gradientOverlay}
    start={{ x: 0.5, y: 1 }}
    end={{ x: 0.5, y: 0.3 }}
  />

  {/* Black Overlay */}
  <View style={styles.overlay} />

      <View style={styles.overlay} />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButton} onPress={handleBackPress}>
          <Ionicons name="person" size={24} color={Colors[theme].redText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.topBarButton}>
          <Ionicons name="chatbubble" size={24} color={Colors[theme].redText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.topBarButton}>
          <Ionicons name="notifications" size={24} color={Colors[theme].redText} />
        </TouchableOpacity>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfo}>
        <RnText style={styles.nameText}>
          {profileData.name}, {profileData.age}
        </RnText>
        <RnText style={styles.professionText}>{profileData.profession}</RnText>

        {/* Status Tags */}
        <View style={styles.tagsContainer}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="location" size={14} color={Colors[theme].redText} />
              <RnText style={styles.distanceText}>{profileData.distance}</RnText>
            </View>
            
            <View style={styles.tag}>
              <Ionicons name="lock-closed" size={14} color={Colors[theme].redText} />
              <RnText style={styles.distanceText}>Private Photos</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="checkmark-circle" size={14} color={Colors[theme].greenText} />
              <RnText style={styles.distanceText}>Active today</RnText>
            </View>
            
            <View style={styles.tag}>
              <Ionicons name="refresh" size={14} color={Colors[theme].redText} />
              <RnText style={styles.distanceText}>Practicing</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <RnText style={styles.distanceText}>🇺🇸</RnText>
              <RnText style={styles.distanceText}>{profileData.country}</RnText>
            </View>
            
            <View style={styles.tag}>
              <Ionicons name="people" size={14} color={Colors[theme].redText} />
              <RnText style={styles.distanceText}>%{profileData.matchPercentage}</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="shield-checkmark" size={14} color={Colors[theme].redText} />
              <RnText style={styles.distanceText}>{profileData.trustScore}</RnText>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.refreshButton]} onPress={handleRefreshPress}>
          <Ionicons name="refresh" size={28} color={Colors[theme].whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={handleDislikePress}>
          <Ionicons name="close" size={32} color={Colors[theme].whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleHeartPress}>
          <Ionicons name="heart" size={32} color={Colors[theme].whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={handleSuperLikePress}>
          <Ionicons name="heart-circle" size={28} color={Colors[theme].whiteText} />
        </TouchableOpacity>
      </View>

    


    </Container>
  );
}

