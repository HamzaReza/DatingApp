/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/swipeProfile.styles";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import {
  getCurrentAuth,
  getNextUserForSwipe,
  getRandomUser,
  getUserByUidAsync,
  recordLike,
  updateUser,
} from "@/firebase/auth";
import { sendInAppNotification } from "@/helpers/notificationHelper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { resetViewedUsers } from "@/redux/slices/swipeSlice";
import { RootState, store } from "@/redux/store";
import { encodeImagePath } from "@/utils";
import getDistanceFromLatLonInMeters from "@/utils/Distance";
import { calculateMatchScore } from "@/utils/MatchScore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export default function SwipeProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likedUserIds, setLikedUserIds] = useState<string[]>([]);
  const { user: reduxUser } = useSelector((state: RootState) => state.user);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      initializeSwipeProfile();
    }, [])
  );

  const initializeSwipeProfile = async () => {
    try {
      setLoading(true);
      // Reset viewed users when initializing
      store.dispatch(resetViewedUsers());

      const currentUserData = reduxUser || (await getCurrentAuth()).currentUser;
      setCurrentUser(currentUserData);

      if (currentUserData?.uid) {
        const randomUser = await getRandomUser(
          currentUserData.uid,
          likedUserIds
        );
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

  const handleUserPress = () => {
    router.push({
      pathname: "/discover/[id]",
      params: { id: profileData?.uid, isFriend: "false" },
    });
  };

  const updateTrustScore = async (userId: string) => {
    try {
      // Use async version to get current user data once
      const currentUserData = await getUserByUidAsync(userId);

      if (currentUserData) {
        let newTrustScore: number;

        if (
          currentUserData.trustScore !== undefined &&
          currentUserData.trustScore !== null
        ) {
          // If trustScore exists, subtract 1 but don't go below 0
          newTrustScore = Math.max(0, currentUserData.trustScore - 1);
        } else {
          // If trustScore doesn't exist, start with 100 - 1 = 99
          newTrustScore = 99;
        }

        // Update user with new trust score
        await updateUser(userId, { trustScore: newTrustScore }, dispatch);
      }
    } catch (error) {
      console.error("Error updating trust score:", error);
    }
  };

  const handleRefreshPress = async () => {
    setLoading(true);
    try {
      if (!currentUser?.uid) {
        return;
      }

      // Get state before fetching
      const preState = store.getState();
      const preViewedIds = preState.swipe.viewedUserIds;
      const nextUser = await getNextUserForSwipe(currentUser.uid, likedUserIds);

      if (nextUser) {
        // Get state after fetching
        const postState = store.getState();
        const postViewedIds = postState.swipe.viewedUserIds;

        setProfileData(nextUser);

        if (postViewedIds.length === 1 && preViewedIds.length > 0) {
          Toast.show({
            type: "info",
            text1: "Showing profiles from the beginning",
            visibilityTime: 2000,
          });
        }
      } else {
        Toast.show({
          type: "info",
          text1: "No more profiles available",
          text2: "Please try again later",
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error("Refresh error:", error);
      Toast.show({
        type: "error",
        text1: "Error loading profile",
        text2: "Please try again",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikePress = async () => {
    setLoading(true);
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      const { isMatch } = await recordLike(currentUser.uid, profileData.id);

      // Update trust score
      await updateTrustScore(currentUser.uid);

      setLikedUserIds(prev => [...prev, profileData.id]);

      if (isMatch) {
        router.push("/(tabs)/matches");
        return;
      } else {
        await sendInAppNotification({
          toUserId: profileData.id,
          title: "You got a Like!",
          subtitle: `${reduxUser.name} liked your profile`,
          type: "like",
          data: {
            id: currentUser.uid,
            image: currentUser.photo,
          },
        });
      }

      const nextUser = await getNextUserForSwipe(currentUser.uid, [
        ...likedUserIds,
        profileData.id,
      ]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislikePress = async () => {
    setLoading(true);
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      setLikedUserIds(prev => [...prev, profileData.id]);

      // Get next user
      const nextUser = await getNextUserForSwipe(currentUser.uid, [
        ...likedUserIds,
        profileData.id,
      ]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuperLikePress = async () => {
    setLoading(true);
    try {
      if (!currentUser?.uid || !profileData?.id) return;

      const { isMatch } = await recordLike(currentUser.uid, profileData.id);

      // Update trust score
      await updateTrustScore(currentUser.uid);

      setLikedUserIds(prev => [...prev, profileData.id]);

      if (isMatch) {
        router.push("/(tabs)/matches");

        await sendInAppNotification({
          toUserId: profileData.id,
          title: "It's a Match!",
          subtitle: `${currentUser.name || "Someone"} matched with you!`,
          type: "match",
          data: {
            id: currentUser.uid,
            image: currentUser.photo,
          },
        });

        return;
      }

      const nextUser = await getNextUserForSwipe(currentUser.uid, [
        ...likedUserIds,
        profileData.id,
      ]);
      if (nextUser) {
        setProfileData(nextUser);
      }
    } catch (error) {
      console.error("Error handling super like:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container customStyle={styles.container}>
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
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors[theme].primary} />
          </View>
        </LinearGradient>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container customStyle={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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

  const distance = getDistanceFromLatLonInMeters(
    profileData.location.latitude,
    profileData.location.longitude,
    currentUser?.location?.latitude,
    currentUser?.location?.longitude
  );

  const formatDistance = (distanceInMeters: number) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
  };

  const religionIcon =
    profileData?.religion === "islam"
      ? "mosque"
      : profileData?.religion === "hinduism"
      ? "temple-hindu"
      : profileData?.religion === "christianity"
      ? "church"
      : profileData?.religion === "judaism"
      ? "synagogue"
      : "mosque";

  return (
    <Container customStyle={styles.container}>
      <Image
        source={{
          uri: encodeImagePath(profileData.photo),
        }}
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
            onPress={handleUserPress}
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
                  {formatDistance(distance)}
                </RnText>
              </View>

              <View style={styles.tag}>
                <MaterialIcons
                  name={religionIcon}
                  size={14}
                  color={Colors.light.redText}
                />
                <RnText style={styles.practicingText}>
                  {profileData?.religion}
                </RnText>
              </View>
            </View>

            <View style={styles.tag}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={Colors.light.redText}
              />
              <RnText style={styles.trustText}>
                {calculateMatchScore(
                  {
                    userId: currentUser.uid,
                    intent: currentUser.lookingFor,
                    profileScore: currentUser.profileScore,
                  },
                  {
                    userId: profileData.uid,
                    intent: profileData.lookingFor,
                    profileScore: profileData.profileScore,
                  }
                )}
                % Match score
              </RnText>
            </View>

            <View style={styles.tag}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={Colors.light.redText}
              />
              <RnText style={styles.trustText}>
                {profileData.trustScore || 100}% Trust score
              </RnText>
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
            onPress={handleLikePress}
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
