/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/home.styles";
import CommentModal from "@/components/CommentModal";
import GalleryCard from "@/components/GalleryCard";
import ReelCard from "@/components/ReelCard";
import RnAvatar from "@/components/RnAvatar";
import Container from "@/components/RnContainer";
import RnModal from "@/components/RnModal";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import StoryCircle from "@/components/StoryCircle";
import { Colors } from "@/constants/Colors";
import {
  fetchAllUserStories,
  fetchStoriesForUser,
  getUserByUid,
  handleStoryUpload,
  listenToUserNotifications,
  updateUser,
} from "@/firebase/auth";
import { fetchUserGallery, GalleryImage } from "@/firebase/gallery";
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

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Story = {
  id: string;
  username: string;
  image: string;
  isOwn: boolean;
};

type NotificationItem = {
  read: boolean;
};

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);

  const [hasNotification, setHasNotification] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [combinedContent, setCombinedContent] = useState<
    (Reel | GalleryImage)[]
  >([]);
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

        if (user?.uid) {
          await updateUser(user.uid, {
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
    const unsubscribeReels = getReels();
    const unsubscribeGallery = getGalleryImages();

    let userListener: (() => void) | null = null;
    let notificationListener: (() => void) | null = null;

    if (user?.uid) {
      userListener = getUserByUid(user.uid, userData => {
        if (!userData) {
          dispatch(setToken(null));
          router.dismissAll();
          router.replace("/onboarding");
        }
      });

      // Listen to notifications and update hasNotification state
      notificationListener = listenToUserNotifications(
        user.uid,
        (notifications: NotificationItem[]) => {
          const hasUnreadNotifications = notifications.some(
            notification => !notification.read
          );
          setHasNotification(hasUnreadNotifications);
        }
      );
    }

    const interval = setInterval(() => {
      getCurrentLocation();
    }, 60000);

    return () => {
      if (unsubscribeReels) {
        unsubscribeReels();
      }
      if (unsubscribeGallery) {
        unsubscribeGallery();
      }
      if (userListener) {
        userListener();
      }
      if (notificationListener) {
        notificationListener();
      }
      clearInterval(interval);
      // Clean up comment listener if it exists
      if (commentListener) {
        commentListener();
      }
    };
  }, [user?.uid]);

  useEffect(() => {
    setOptimisticUpdates({});
  }, [reels]);

  useEffect(() => {
    combineAndSortContent();
  }, [reels, galleryImages]);

  const getStories = async () => {
    try {
      const stories = await fetchAllUserStories(user?.uid);
      setAllStories(stories);

      // Extract user IDs who have stories (excluding current user if needed)
      const usersWithStories = stories
        .filter((story: any) => story.hasActiveStories)
        .map((story: any) => story.id);

      return usersWithStories;
    } catch (error) {
      console.log("error when fetch stories", error);
      return [];
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

  const getGalleryImages = () => {
    try {
      const unsubscribe = fetchUserGallery((imagesData: GalleryImage[]) => {
        setGalleryImages(imagesData);
      });

      return unsubscribe;
    } catch (error) {
      console.log("error when fetch gallery images", error);
    }
  };

  const combineAndSortContent = () => {
    const combined = [...reels, ...galleryImages];

    // Sort by creation date, latest first
    combined.sort((a, b) => {
      let dateA: Date;
      let dateB: Date;

      // Handle different types of createdAt
      if (a.createdAt instanceof Date) {
        dateA = a.createdAt;
      } else if (typeof a.createdAt === "string") {
        dateA = new Date(a.createdAt);
      } else {
        // Firebase Timestamp
        dateA = (a.createdAt as any).toDate();
      }

      if (b.createdAt instanceof Date) {
        dateB = b.createdAt;
      } else if (typeof b.createdAt === "string") {
        dateB = new Date(b.createdAt);
      } else {
        // Firebase Timestamp
        dateB = (b.createdAt as any).toDate();
      }

      return dateB.getTime() - dateA.getTime();
    });

    setCombinedContent(combined);
  };

  // In home.tsx - when navigating to story view
  const handleStoryPress = async (userStory: any) => {
    try {
      const usersWithStoriesIds = await getStories();
      const currentUserStories = await fetchStoriesForUser(userStory.id);

      if (currentUserStories && currentUserStories.length > 0) {
        // Filter out auth user BEFORE passing to StoryView
        const filteredUsersWithStories = usersWithStoriesIds.filter(
          (id: any) => id !== user?.uid // ← SKIP AUTH USER HERE
        );

        router.push({
          pathname: "/mainScreens/storyView",
          params: {
            userId: userStory.id,
            username: userStory.username,
            profilePic: userStory.image,
            stories: JSON.stringify(currentUserStories),
            initialStoryIndex: 0,
            allUsersWithStories: JSON.stringify(filteredUsersWithStories), // ← PASS FILTERED LIST
          },
        });
      }
    } catch (error) {
      console.error("Error handling story press:", error);
    }
  };

  // For your own story
  const handleOwnStoryPress = async () => {
    try {
      const usersWithStoriesIds = await getStories();
      const userStories = await fetchStoriesForUser(user?.uid);

      if (userStories && userStories.length > 0) {
        // Filter out auth user BEFORE passing to StoryView
        const filteredUsersWithStories = usersWithStoriesIds.filter(
          (id: any) => id !== user?.uid // ← SKIP AUTH USER HERE
        );

        router.push({
          pathname: "/mainScreens/storyView",
          params: {
            userId: user?.uid,
            username: "My Story",
            profilePic: user?.photo,
            stories: JSON.stringify(userStories),
            initialStoryIndex: 0,
            allUsersWithStories: JSON.stringify(filteredUsersWithStories), // ← PASS FILTERED LIST
          },
        });
      }
    } catch (error) {
      console.error("Error handling own story press:", error);
    }
  };

  const onOwnStoryUpload = async () => {
    try {
      console.log("🎬 Starting story upload flow...");
      setUploading(true);

      const picked: any = await pickStory();
      console.log("📂 Picked asset:", picked);

      if (!picked) {
        console.log("⚠️ No media picked or trimming canceled.");
        return;
      }

      await handleStoryUpload(picked, user);
      console.log("✅ Story uploaded successfully!");
    } catch (err) {
      console.error("❌ Error uploading story:", err);
    } finally {
      setUploading(false);
      console.log("🛑 Upload flow finished.");
    }
  };

  const handleReelAction = async (action: string, contentId: string) => {
    try {
      if (!user) {
        return;
      }

      // Find the content item (reel or gallery image)
      const currentContent = combinedContent.find(
        item => item.id === contentId
      );
      if (!currentContent) return;

      if (action === "like" || action === "dislike") {
        // Check if it's a reel or gallery image
        if ("videoUrl" in currentContent) {
          // This is a reel
          const currentReel = currentContent as Reel;
          const currentLikes = currentReel.likes || [];
          const currentDislikes = currentReel.dislikes || [];
          const isCurrentlyLiked = currentLikes.includes(user.uid);
          const isCurrentlyDisliked = currentDislikes.includes(user.uid);
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
            [contentId]: {
              likes: newLikeCount,
              dislikes: newDislikeCount,
              isLiked: newIsLiked,
              isDisliked: newIsDisliked,
            },
          }));

          try {
            await likeDislikeReel(
              contentId,
              user.uid,
              action as "like" | "dislike"
            );
            // Optimistic update successful, keep the state
          } catch (error) {
            setOptimisticUpdates(prev => {
              const newState = { ...prev };
              delete newState[contentId];
              return newState;
            });

            console.error(`Error ${action}ing reel:`, error);
            showToaster({
              type: "error",
              heading: "Action Failed",
              message: `Failed to ${action} reel. Please try again.`,
            });
          }
        } else {
          // This is a gallery image
          const currentImage = currentContent as GalleryImage;
          const currentLikes = currentImage.likes || [];
          const currentDislikes = currentImage.dislikes || [];
          const isCurrentlyLiked = currentLikes.includes(user.uid);
          const isCurrentlyDisliked = currentDislikes.includes(user.uid);
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
            [contentId]: {
              likes: newLikeCount,
              dislikes: newDislikeCount,
              isLiked: newIsLiked,
              isDisliked: newIsDisliked,
            },
          }));

          try {
            // Import and use likeDislikeImage for gallery images
            const { likeDislikeImage } = await import("@/firebase/gallery");
            await likeDislikeImage(
              contentId,
              user.uid,
              action as "like" | "dislike"
            );
            // Optimistic update successful, keep the state
          } catch (error) {
            setOptimisticUpdates(prev => {
              const newState = { ...prev };
              delete newState[contentId];
              return newState;
            });

            console.error(`Error ${action}ing image:`, error);
            showToaster({
              type: "error",
              heading: "Action Failed",
              message: `Failed to ${action} image. Please try again.`,
            });
          }
        }
      } else if (action === "comment") {
        // Only reels support comments
        if ("videoUrl" in currentContent) {
          const currentReel = currentContent as Reel;
          setSelectedReelForComment(currentReel);
          setCommentModalVisible(true);

          // Set up real-time listener for comments
          const unsubscribe = listenToReelComments(contentId, comments => {
            setSelectedReelForComment(prev =>
              prev ? { ...prev, comments } : null
            );
            // Also update the main reels state
            setReels(prevReels =>
              prevReels.map(reel =>
                reel.id === contentId ? { ...reel, comments } : reel
              )
            );
          });
          setCommentListener(() => unsubscribe);
        }
      }
    } catch (error) {
      console.log("error when handle reel action", error);
    }
  };

  const handleReelPress = (reel: Reel) => {
    console.log("Reel pressed:", reel.id);
  };

  const handleAddComment = async (comment: string) => {
    if (!selectedReelForComment) return;

    if (!user) {
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
      id: `${Date.now()}_${user.uid}`,
      userId: user.uid,
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
      await addCommentToReel(selectedReelForComment.id, comment, user);
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
      allowsMultipleSelection: false,
      quality: 0.8,
      videoMaxDuration: 15, // ⬅️ max 15s
    });

    if (!result.canceled) {
      const validStories = [];

      for (const asset of result.assets) {
        if (asset.type === "video" && (asset.duration || 0) > 15000) {
          // 🔥 Show message for videos longer than 15 seconds
          Alert.alert(
            "Video Too Long",
            "Please select a video shorter than 15 seconds",
            [{ text: "OK" }]
          );
          continue; // Skip this video
        }

        validStories.push({
          uri: asset.uri,
          type: asset.type, // "image" or "video"
          duration: asset.duration || 0,
        });
      }

      return validStories;
    }

    return [];
  };
  return (
    <Container>
      <View style={styles.titleContainer}>
        <RnText style={styles.titleText}>XYZ</RnText>
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
              image={item.image}
              username={item.username || "user"}
              isOwn={item.isOwn}
              // 🟢 Use different logic if it's own story
              onPress={
                () =>
                  item.isOwn
                    ? handleOwnStoryPress() // <- own story check
                    : handleStoryPress(item) // <- others' story
              }
              ownUploadOnPress={onOwnStoryUpload} // plus icon
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      <FlatList
        data={combinedContent}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: combinedContent?.length > 0 ? hp(50) : hp(8),
        }}
        renderItem={({ item }) => {
          // Check if item is a Reel or GalleryImage
          if ("videoUrl" in item) {
            // This is a Reel
            const reel = item as Reel;
            const optimisticState = optimisticUpdates[reel.id];
            const isLiked = user
              ? (reel.likes || []).includes(user.uid)
              : false;
            const isDisliked = user
              ? (reel.dislikes || []).includes(user.uid)
              : false;

            return (
              <ReelCard
                reel={reel}
                onLike={() => handleReelAction("like", reel.id)}
                onDislike={() => handleReelAction("dislike", reel.id)}
                onComment={() => handleReelAction("comment", reel.id)}
                onPress={() => handleReelPress(reel)}
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
          } else {
            // This is a GalleryImage
            const image = item as GalleryImage;
            const isLiked = user
              ? (image.likes || []).includes(user.uid)
              : false;
            const isDisliked = user
              ? (image.dislikes || []).includes(user.uid)
              : false;

            return (
              <GalleryCard
                image={image}
                onLike={() => handleReelAction("like", image.id)}
                onDislike={() => handleReelAction("dislike", image.id)}
                optimisticLikes={optimisticUpdates[image.id]?.likes}
                optimisticDislikes={optimisticUpdates[image.id]?.dislikes}
                isLiked={isLiked}
                isDisliked={isDisliked}
              />
            );
          }
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
              No content available. Be the first to share a reel or image!
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
      <RnModal show={uploading}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors[theme].whiteText} />
        </View>
      </RnModal>
    </Container>
  );
}
