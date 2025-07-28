/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/home.styles";
import CommentModal from "@/components/CommentModal";
import ReelCard from "@/components/ReelCard";
import RnAvatar from "@/components/RnAvatar";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import StoryCircle from "@/components/StoryCircle";
import { Colors } from "@/constants/Colors";
import {
  fetchAllUserStories,
  fetchStoriesForUser,
  handleStoryUpload,
  updateUser,
} from "@/firebase/auth";
import {
  addCommentToReel,
  fetchUserReels,
  likeDislikeReel,
  listenToReelComments,
  Reel,
} from "@/firebase/reels";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  setDeviceLocation,
  setLocationPermissionGranted,
  setToken,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp, wp } from "@/utils";
import { requestLocationPermission } from "@/utils/Permission";
import { getAuth } from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Story = {
  id: string;
  username: string;
  image: string;
  isOwn: boolean;
};

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);

  const [hasNotification] = useState(true);

  const dispatch = useDispatch();
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [reelId: string]: {
      likes: number;
      dislikes: number;
      isLiked: boolean;
      isDisliked: boolean;
    };
  }>({});
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedReelForComment, setSelectedReelForComment] =
    useState<Reel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentListener, setCommentListener] = useState<(() => void) | null>(
    null
  );

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        dispatch(setLocationPermissionGranted(true));
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setDeviceLocation(location));

        const currentUser = getAuth().currentUser?.uid;

        if (currentUser) {
          await updateUser(currentUser, {
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: new Date().toISOString(),
            },
          });
        }
      } else {
        dispatch(setLocationPermissionGranted(false));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      dispatch(setLocationPermissionGranted(false));
    }
  };

  useEffect(() => {
    getCurrentLocation();
    getStories();
    const unsubscribe = getReels();

    const interval = setInterval(() => {
      getCurrentLocation();
    }, 60000);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearInterval(interval);
      // Clean up comment listener if it exists
      if (commentListener) {
        commentListener();
      }
    };
  }, []);

  useEffect(() => {
    setOptimisticUpdates({});
  }, [reels]);

  const getStories = async () => {
    try {
      const stories = await fetchAllUserStories();
      setAllStories(stories);
    } catch (error) {
      console.log("error when fetch stories", error);
    }
  };

  const getReels = () => {
    try {
      const unsubscribe = fetchUserReels((reelsData: Reel[]) => {
        setReels(reelsData);
      });

      return unsubscribe;
    } catch (error) {
      console.log("error when fetch reels", error);
    }
  };

  const handleStoryPress = async (userStory: Story) => {
    const currentUserStories = await fetchStoriesForUser(userStory.id);

    router.push({
      pathname: "/mainScreens/storyView",
      params: {
        userId: userStory.id,
        username: userStory.username,
        profilePic: userStory.image,
        stories: JSON.stringify(currentUserStories),
        initialStoryIndex: 0,
      },
    });
  };

  const handleReelAction = async (action: string, reelId: string) => {
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        return;
      }

      if (action === "like" || action === "dislike") {
        const currentReel = reels.find(reel => reel.id === reelId);
        if (!currentReel) return;

        const currentLikes = currentReel.likes || [];
        const currentDislikes = currentReel.dislikes || [];
        const isCurrentlyLiked = currentLikes.includes(currentUser.uid);
        const isCurrentlyDisliked = currentDislikes.includes(currentUser.uid);
        const currentLikeCount = currentLikes.length;
        const currentDislikeCount = currentDislikes.length;

        let newLikeCount: number;
        let newDislikeCount: number;
        let newIsLiked: boolean;
        let newIsDisliked: boolean;

        if (action === "like") {
          if (isCurrentlyLiked) {
            newLikeCount = Math.max(0, currentLikeCount - 1);
            newIsLiked = false;
          } else {
            newLikeCount = currentLikeCount + 1;
            newIsLiked = true;
          }

          if (isCurrentlyDisliked) {
            newDislikeCount = Math.max(0, currentDislikeCount - 1);
            newIsDisliked = false;
          } else {
            newDislikeCount = currentDislikeCount;
            newIsDisliked = false;
          }
        } else {
          if (isCurrentlyDisliked) {
            newDislikeCount = Math.max(0, currentDislikeCount - 1);
            newIsDisliked = false;
          } else {
            newDislikeCount = currentDislikeCount + 1;
            newIsDisliked = true;
          }

          if (isCurrentlyLiked) {
            newLikeCount = Math.max(0, currentLikeCount - 1);
            newIsLiked = false;
          } else {
            newLikeCount = currentLikeCount;
            newIsLiked = false;
          }
        }

        setOptimisticUpdates(prev => ({
          ...prev,
          [reelId]: {
            likes: newLikeCount,
            dislikes: newDislikeCount,
            isLiked: newIsLiked,
            isDisliked: newIsDisliked,
          },
        }));

        try {
          await likeDislikeReel(
            reelId,
            currentUser.uid,
            action as "like" | "dislike"
          );

          // Optimistic update successful, keep the state
        } catch (error) {
          setOptimisticUpdates(prev => {
            const newState = { ...prev };
            delete newState[reelId];
            return newState;
          });

          console.error(`Error ${action}ing reel:`, error);
          showToaster({
            type: "error",
            heading: "Action Failed",
            message: `Failed to ${action} reel. Please try again.`,
          });
        }
      } else if (action === "comment") {
        const currentReel = reels.find(reel => reel.id === reelId);
        if (currentReel) {
          setSelectedReelForComment(currentReel);
          setCommentModalVisible(true);

          // Set up real-time listener for comments
          const unsubscribe = listenToReelComments(reelId, comments => {
            setSelectedReelForComment(prev =>
              prev ? { ...prev, comments } : null
            );
            // Also update the main reels state
            setReels(prevReels =>
              prevReels.map(reel =>
                reel.id === reelId ? { ...reel, comments } : reel
              )
            );
          });
          setCommentListener(() => unsubscribe);
        }
      }
    } catch (error) {
      console.error(`Error handling reel action ${action}:`, error);
    }
  };

  const handleReelPress = (reel: Reel) => {
    console.log("Reel pressed:", reel.id);
  };

  const handleAddComment = async (comment: string) => {
    if (!selectedReelForComment) return;

    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      showToaster({
        type: "error",
        heading: "Authentication Error",
        message: "Please log in to comment.",
      });
      return;
    }

    setIsSubmitting(true);

    // Create optimistic comment for immediate UI feedback
    const optimisticComment = {
      id: `${Date.now()}_${currentUser.uid}`,
      userId: currentUser.uid,
      username: user?.name || "User",
      userPhoto: user?.photo || "",
      content: comment.trim(),
      createdAt: new Date(),
    };

    // Add optimistic comment immediately
    setSelectedReelForComment(prev =>
      prev
        ? { ...prev, comments: [...(prev.comments || []), optimisticComment] }
        : null
    );

    try {
      await addCommentToReel(selectedReelForComment.id, comment);
      // The real-time listener will automatically update the state with the server response
    } catch (error) {
      // Remove optimistic comment on error
      setSelectedReelForComment(prev =>
        prev
          ? {
              ...prev,
              comments:
                prev.comments?.filter(c => c.id !== optimisticComment.id) || [],
            }
          : null
      );

      console.error("Error adding comment:", error);
      showToaster({
        type: "error",
        heading: "Comment Failed",
        message: "Failed to add comment. Please try again.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedReelForComment(null);

    // Clean up the comment listener
    if (commentListener) {
      commentListener();
      setCommentListener(null);
    }
  };

  const pickStory = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets.map(asset => asset.uri);
    }

    return [];
  };

  return (
    <Container>
      <View style={styles.titleContainer}>
        <RnText
          style={styles.titleText}
          onPress={() => {
            router.dismissAll();
            router.replace("/onboarding");
            dispatch(setToken(null));
          }}
        >
          XYZ
        </RnText>
        <View style={styles.headerIconContainer}>
          <RoundButton
            iconName="notifications-none"
            iconSize={24}
            iconColor={Colors[theme].primary}
            backgroundColour={Colors[theme].whiteText}
            onPress={() => router.push("/main/notification")}
            showDot={hasNotification}
          />
          <TouchableOpacity
            style={{}}
            onPress={() => router.push(`/discover/${user?.uid}`)}
          >
            <RnAvatar
              source={encodeImagePath(user?.photo)}
              avatarHeight={wp(9)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.storiesContainer}>
        <FlatList
          data={allStories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <StoryCircle
              image={encodeImagePath(item.image)}
              username={item.username || "user"}
              isOwn={item.isOwn}
              onPress={() => handleStoryPress(item)}
              ownUploadOnPress={() => handleStoryUpload(pickStory(), user)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      <FlatList
        data={reels}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: reels?.length > 0 ? hp(50) : hp(8),
        }}
        renderItem={({ item }: { item: Reel }) => {
          const optimisticState = optimisticUpdates[item.id];
          const currentUser = getAuth().currentUser;
          const isLiked = currentUser
            ? (item.likes || []).includes(currentUser.uid)
            : false;
          const isDisliked = currentUser
            ? (item.dislikes || []).includes(currentUser.uid)
            : false;

          return (
            <ReelCard
              reel={item}
              onLike={() => handleReelAction("like", item.id)}
              onDislike={() => handleReelAction("dislike", item.id)}
              onComment={() => handleReelAction("comment", item.id)}
              onPress={() => handleReelPress(item)}
              optimisticLikes={optimisticState?.likes}
              optimisticDislikes={optimisticState?.dislikes}
              isLiked={
                optimisticState?.isLiked !== undefined
                  ? optimisticState.isLiked
                  : isLiked
              }
              isDisliked={
                optimisticState?.isDisliked !== undefined
                  ? optimisticState.isDisliked
                  : isDisliked
              }
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RnText style={{ color: Colors[theme].tabIconDefault }}>
              No reels available. Be the first to share a reel!
            </RnText>
          </View>
        }
      />

      <CommentModal
        visible={commentModalVisible}
        onClose={handleCloseCommentModal}
        comments={selectedReelForComment?.comments || []}
        onAddComment={handleAddComment}
        loading={isSubmitting}
      />
    </Container>
  );
}
