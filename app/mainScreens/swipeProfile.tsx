import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/FontFamily';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

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
          <Ionicons name="person" size={24} color={Colors.light.redText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.topBarButton}>
          <Ionicons name="chatbubble" size={24} color={Colors.light.redText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.topBarButton}>
          <Ionicons name="notifications" size={24} color={Colors.light.redText} />
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
            <View style={[styles.tag, styles.distanceTag]}>
              <Ionicons name="location" size={14} color={Colors.light.redText} />
              <RnText style={styles.distanceText}>{profileData.distance}</RnText>
            </View>
            
            <View style={[styles.tag, styles.privateTag]}>
              <Ionicons name="lock-closed" size={14} color={Colors.light.redText} />
              <RnText style={styles.privateText}>Private Photos</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.activeTag]}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.light.greenText} />
              <RnText style={styles.activeText}>Active today</RnText>
            </View>
            
            <View style={[styles.tag, styles.practicingTag]}>
              <Ionicons name="refresh" size={14} color={Colors.light.redText} />
              <RnText style={styles.practicingText}>Practicing</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.countryTag]}>
              <RnText style={styles.flagText}>🇺🇸</RnText>
              <RnText style={styles.countryText}>{profileData.country}</RnText>
            </View>
            
            <View style={[styles.tag, styles.matchTag]}>
              <Ionicons name="people" size={14} color={Colors.light.redText} />
              <RnText style={styles.matchText}>%{profileData.matchPercentage}</RnText>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.trustTag]}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.light.redText} />
              <RnText style={styles.trustText}>{profileData.trustScore}</RnText>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.refreshButton]} onPress={handleRefreshPress}>
          <Ionicons name="refresh" size={28} color={Colors.light.whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={handleDislikePress}>
          <Ionicons name="close" size={32} color={Colors.light.whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleHeartPress}>
          <Ionicons name="heart" size={32} color={Colors.light.whiteText} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={handleSuperLikePress}>
          <Ionicons name="heart-circle" size={28} color={Colors.light.whiteText} />
        </TouchableOpacity>
      </View>

    


    </Container>
  );
}

const createStyles = (theme:'light'| 'dark')=>StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
    padding:0,
    paddingVertical:0,
    paddingHorizontal:0
  },
  backgroundImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    backgroundColor: 'rgba(255,179,186,0.9)',
    borderRadius: Borders.radius2,
    marginHorizontal: wp(20),
    marginTop: hp(2),
    alignSelf:'center',
    gap:wp(10)
  },
  topBarButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    position: 'absolute',
    bottom: hp(18),
    left: wp(6),
    right: wp(6),
  },
  nameText: {
    fontSize: FontSize.extraLarge,
    fontFamily:FontFamily.bold,
    color: Colors.light.whiteText,
    marginBottom: hp(0.5),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  professionText: {
    fontSize: FontSize.large,
    color: Colors.light.whiteText,
    marginBottom: hp(2),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagsContainer: {
    gap: hp(1),
    alignItems:'center',
    zIndex:1
  },
  tagRow: {
    flexDirection: 'row',
    gap: wp(3),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(10px)',
    borderColor:Colors[theme].whiteText,
    borderWidth:0.5
  },

  distanceText: {
    color: Colors.light.whiteText,
    fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  privateText: {
    color: Colors.light.whiteText,
    fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  activeText: {
    color: Colors.light.whiteText,
     fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  practicingText: {
    color: Colors.light.whiteText,
  fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  flagText: {
      fontSize: FontSize.small,
  },
  countryText: {
    color: Colors.light.whiteText,
     fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  matchText: {
    color: Colors.light.whiteText,
   fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  trustText: {
    color: Colors.light.whiteText,
      fontSize: FontSize.regular,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  actionButtons: {
    position: 'absolute',
    bottom: hp(8),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
    zIndex:1
  },
  actionButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: Borders.circle,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshButton: {
    backgroundColor: Colors.light.pink,
  },
  dislikeButton: {
    backgroundColor: Colors.light.pink,
  },
  likeButton: {
    backgroundColor: Colors.light.pink,
  },
  superLikeButton: {
    backgroundColor: Colors.light.pink,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    right: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: hp(2),
    borderRadius: wp(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: Colors.light.primary,
  },
  gradientOverlay: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: hp(55), // adjust as needed for your design
  zIndex: 1,
},
});