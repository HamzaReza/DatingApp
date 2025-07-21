import createStyles from "@/app/tabStyles/swipeProfile.styles";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { getCurrentAuth, getNextUserForSwipe, getRandomUser, recordLike } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function SwipeProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likedUserIds, setLikedUserIds] = useState<string[]>([]);
  const { user: reduxUser } = useSelector((state: RootState) => state.user);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  useEffect(() => {
    initializeSwipeProfile();
  }, []);

  const initializeSwipeProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user from Redux or Firebase auth
      const currentUserData = reduxUser || (await getCurrentAuth()).currentUser;
      setCurrentUser(currentUserData);

      if (currentUserData?.uid) {
        // Fetch first random user
        const randomUser = await getRandomUser(currentUserData.uid, likedUserIds);
        if (randomUser) {
          setProfileData(randomUser);
        }
      }
    } catch (error) {
      console.error("Error initializing swipe profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleRefreshPress = async () => {
    try {
      if (!currentUser?.uid) return;
      
      const nextUser = await getNextUserForSwipe(currentUser.uid, likedUserIds);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const handleLikePress = async () => {
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      // Record the like
      const { isMatch } = await recordLike(currentUser.uid, profileData.id);
      
      // Add to liked users list
      setLikedUserIds(prev => [...prev, profileData.id]);

      if (isMatch) {
        // It's a match! Navigate to matches tab
        router.push("/(tabs)/matches");
        return;
      }

      // Get next user
      const nextUser = await getNextUserForSwipe(currentUser.uid, [...likedUserIds, profileData.id]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislikePress = async () => {
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      // Add to liked users list (to avoid showing again)
      setLikedUserIds(prev => [...prev, profileData.id]);

      // Get next user
      const nextUser = await getNextUserForSwipe(currentUser.uid, [...likedUserIds, profileData.id]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  const handleHeartPress = () => {
    // Same as like
    handleLikePress();
  };

  const handleSuperLikePress = async () => {
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      // Record the like (super like is treated as a regular like for now)
      const { isMatch } = await recordLike(currentUser.uid, profileData.id);
      
      // Add to liked users list
      setLikedUserIds(prev => [...prev, profileData.id]);

      if (isMatch) {
        // It's a match! Navigate to matches tab
        router.push("/(tabs)/matches");
        return;
      }

      // Get next user
      const nextUser = await getNextUserForSwipe(currentUser.uid, [...likedUserIds, profileData.id]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling super like:", error);
    }
  };

  const handleTabPress = (tabName: string) => {
    console.log(`${tabName} tab pressed`);
  };

  if (loading) {
    return (
      <Container customStyle={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors[theme].primary} />
          <RnText style={{ marginTop: 10 }}>Loading profile...</RnText>
        </View>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container customStyle={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <RnText>No more profiles to show</RnText>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshButton]}
            onPress={handleRefreshPress}
          >
            <Ionicons name="refresh" size={28} color={Colors.light.whiteText} />
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container customStyle={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: profileData.photo || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" }}
        style={styles.backgroundImage}
      />

      <LinearGradient
        colors={[
          "rgba(118,202,187,0.8)",
          "rgba(118,202,187,0.8)",
          "rgba(118,202,187,0)",
        ]}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.3 }}
      >
        {/* Black Overlay */}
        <View style={styles.overlay} />

        <View style={styles.overlay} />

        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={handleBackPress}
          >
            <Ionicons name="person" size={24} color={Colors.light.redText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topBarButton}>
            <Ionicons
              name="chatbubble"
              size={24}
              color={Colors.light.redText}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topBarButton}>
            <Ionicons
              name="notifications"
              size={24}
              color={Colors.light.redText}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.profileInfo}>
          <RnText style={styles.nameText}>
            {profileData.name}, {profileData.age}
          </RnText>
          <RnText style={styles.professionText}>
            {profileData.profession || "Professional"}
          </RnText>

          {/* Status Tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Ionicons
                  name="location"
                  size={14}
                  color={Colors.light.redText}
                />
                <RnText style={styles.distanceText}>
                  {profileData.distance || "Nearby"}
                </RnText>
              </View>

              <View style={styles.tag}>
                <Ionicons
                  name="lock-closed"
                  size={14}
                  color={Colors.light.redText}
                />
                <RnText style={styles.privateText}>Private Photos</RnText>
              </View>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.light.greenText}
                />
                <RnText style={styles.activeText}>Active today</RnText>
              </View>

              <View style={styles.tag}>
                <Ionicons
                  name="refresh"
                  size={14}
                  color={Colors.light.redText}
                />
                <RnText style={styles.practicingText}>Practicing</RnText>
              </View>
            </View>

            {profileData.country && (
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Ionicons name="flag" size={14} color={Colors.light.redText} />
                  <RnText style={styles.countryText}>
                    {profileData.country}
                  </RnText>
                </View>

                <View style={styles.tag}>
                  <Ionicons
                    name="people"
                    size={14}
                    color={Colors.light.redText}
                  />
                  <RnText style={styles.matchText}>
                    %{profileData.matchScore || 85}
                  </RnText>
                </View>
              </View>
            )}

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={Colors.light.redText}
                />
                <RnText style={styles.trustText}>
                  Trust score
                </RnText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshButton]}
            onPress={handleRefreshPress}
          >
            <Ionicons name="refresh" size={28} color={Colors.light.whiteText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={handleDislikePress}
          >
            <Ionicons name="close" size={32} color={Colors.light.whiteText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleHeartPress}
          >
            <Ionicons name="heart" size={32} color={Colors.light.whiteText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.superLikeButton]}
            onPress={handleSuperLikePress}
          >
            <Ionicons
              name="heart-circle"
              size={28}
              color={Colors.light.whiteText}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Container>
  );
}
