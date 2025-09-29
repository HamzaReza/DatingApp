/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/mainScreens/styles/storyView.styles";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { fetchStoriesForUser, getUserByUid } from "@/firebase/auth";
import { useScreenCapture } from "@/hooks/useScreenCapture";
import { encodeImagePath } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { formatTimeAgo } from "@/utils/FormatDate";

const STORY_DURATION = 4000;

export default function StoryView() {
  const {
    userId,
    username,
    profilePic,
    stories: storiesParam,
    allUsersWithStories,
  } = useLocalSearchParams();

  const initialStories = JSON.parse(storiesParam as string);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [allUsers, setAllUsers] = useState([
    { id: userId, username, profilePic, stories: initialStories },
  ]);

  const [allUserIdsWithStories, setAllUserIdsWithStories] = useState<string[]>(
    allUsersWithStories ? JSON.parse(allUsersWithStories as string) : []
  );

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [nextUserData, setNextUserData] = useState<{
    id: string;
    username: string;
    profilePic: string;
    stories: any[];
  } | null>(null);

  const progress = useRef(new Animated.Value(0)).current;
  const longPressTimeoutRef = useRef<number | null>(null);
  const isLongPressRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const videoLoadedRef = useRef(false);

  const currentUser = allUsers[currentUserIndex];
  const currentStories = currentUser?.stories || [];
  const currentStory = currentStories[currentStoryIndex];

  const rawMediaUri = currentStory?.storyUrls?.[0] || null;
  let mediaUri = rawMediaUri;

  if (rawMediaUri && rawMediaUri.includes("%2F")) {
    mediaUri = rawMediaUri.replace(/%2F/g, "/");
  }

  mediaUri = mediaUri ? encodeImagePath(mediaUri) : null;
  const isVideoStory = currentStory?.type === "video";

  console.log("currentUser", currentUser);

  const player = useVideoPlayer(
    isVideoStory && mediaUri ? mediaUri : null,
    (p: any) => {
      p.loop = false;
      p.timeUpdateEventInterval = 0.1;
    }
  );

  const resetMediaState = useCallback(() => {
    stopCurrentAnimation();
    setIsMediaLoading(true);
    progress.setValue(0);
    elapsedTimeRef.current = 0;
    videoLoadedRef.current = false;
  }, [progress]);

  const stopCurrentAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  };

  const preFetchNextUser = async (currentUserId: string) => {
    try {
      const availableUserIds = allUserIdsWithStories;
      if (availableUserIds.length === 0) return;

      const currentIndex = availableUserIds.findIndex(
        id => id === currentUserId
      );
      if (currentIndex === -1) return;

      const nextIndex = (currentIndex + 1) % availableUserIds.length;
      const nextUserId = availableUserIds[nextIndex];

      if (
        nextUserId === currentUserId ||
        allUsers.find(u => u.id === nextUserId)
      ) {
        return;
      }

      const [stories, userData] = await Promise.all([
        fetchStoriesForUser(nextUserId),
        new Promise<any>(resolve => {
          const unsubscribe = getUserByUid(nextUserId, (data: any) => {
            unsubscribe();
            resolve(data);
          });
          setTimeout(() => {
            unsubscribe();
            resolve(null);
          }, 3000);
        }),
      ]);

      if (stories.length > 0 && userData) {
        setNextUserData({
          id: nextUserId,
          username: userData.name || "User",
          profilePic:
            encodeImagePath(userData.photo) ||
            "https://example.com/default.jpg",
          stories: stories,
        });
      }
    } catch (error) {
      console.error("Error pre-fetching next user:", error);
    }
  };

  const goToNextStory = async () => {
    stopCurrentAnimation();

    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      return;
    }

    resetMediaState();

    if (currentUser?.id === userId) {
      console.log("✅ Current user is auth user, closing stories");
      return router.back();
    }

    if (nextUserData) {
      setAllUsers(prev => [...prev, nextUserData]);
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setNextUserData(null);
      return;
    }

    const availableUserIds = allUserIdsWithStories.filter(id => id !== userId);
    if (availableUserIds.length === 0) {
      return router.back();
    }

    const currentUserIndexInList = availableUserIds.findIndex(
      id => id === currentUser?.id
    );
    let nextUserIndexInList;

    if (currentUserIndexInList === -1) {
      nextUserIndexInList = 0;
    } else {
      nextUserIndexInList =
        (currentUserIndexInList + 1) % availableUserIds.length;
      if (availableUserIds[nextUserIndexInList] === currentUser?.id) {
        return router.back();
      }
    }

    const nextUserId = availableUserIds[nextUserIndexInList];
    const existingUserIndex = allUsers.findIndex(u => u.id === nextUserId);

    if (existingUserIndex !== -1) {
      setCurrentUserIndex(existingUserIndex);
      setCurrentStoryIndex(0);
      return;
    }

    try {
      let fetchedStories: any = await fetchStoriesForUser(nextUserId);

      if (!Array.isArray(fetchedStories)) {
        fetchedStories = Object.values(fetchedStories || {});
      }

      if (fetchedStories.length > 0) {
        return new Promise<void>(resolve => {
          const unsubscribe = getUserByUid(nextUserId, (userData: any) => {
            if (userData) {
              const newUser = {
                id: nextUserId,
                username: userData.name || "User",
                profilePic:
                  encodeImagePath(userData.photo) ||
                  "https://example.com/default.jpg",
                stories: fetchedStories,
              };

              setAllUsers(prev => {
                const updated = [...prev, newUser];
                setCurrentUserIndex(updated.length - 1);
                return updated;
              });
              setCurrentStoryIndex(0);
              unsubscribe();
              resolve();
            } else {
              unsubscribe();
              router.back();
              resolve();
            }
          });
        });
      } else {
        setAllUserIdsWithStories(prev => prev.filter(id => id !== nextUserId));
        router.back();
      }
    } catch (error) {
      console.error("Error fetching next user stories:", error);
      router.back();
    }
  };

  useEffect(() => {
    if (!isVideoStory || !player || isPaused) return;

    let animationFrame: number;

    const smoothUpdateProgress = () => {
      if (player.duration > 0) {
        const progressValue = player.currentTime / player.duration;
        progress.setValue(progressValue);

        if (progressValue >= 0.99) {
          goToNextStory();
        }
      }

      // Use requestAnimationFrame for smooth 60fps updates
      animationFrame = requestAnimationFrame(smoothUpdateProgress);
    };

    animationFrame = requestAnimationFrame(smoothUpdateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVideoStory, player, progress, goToNextStory, isPaused]);

  const startStoryTimer = useCallback(
    (duration: number) => {
      stopCurrentAnimation();
      progress.setValue(0);

      animationRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      });

      if (!isMediaLoading) {
        animationRef.current.start(({ finished }) => {
          if (finished) {
            goToNextStory();
          }
        });
      }
    },
    [progress, goToNextStory, isMediaLoading]
  );

  const goToPrevStory = () => {
    stopCurrentAnimation();

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1;
      const prevUserStories = allUsers[prevUserIndex].stories || [];
      setCurrentUserIndex(prevUserIndex);
      setCurrentStoryIndex(prevUserStories.length - 1);
    }
  };

  const handlePressIn = () => {
    isLongPressRef.current = false;
    longPressTimeoutRef.current = setTimeout(() => {
      setIsPaused(true);
      isLongPressRef.current = true;
      elapsedTimeRef.current =
        progress.__getValue() *
        (isVideoStory ? player.duration * 1000 : STORY_DURATION);
    }, 200);

    if (isVideoStory && player) {
      player.pause();
    }
  };

  const handlePressOut = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    setIsPaused(false);
    isLongPressRef.current = false;

    if (isVideoStory && player) {
      player.play();
    }
  };

  const handleScreenPress = (e: any) => {
    if (!isLongPressRef.current) {
      const { locationX } = e.nativeEvent;
      const screenWidth = Dimensions.get("window").width;

      if (locationX < screenWidth / 3) {
        goToPrevStory();
      } else if (locationX > (screenWidth / 3) * 2) {
        goToNextStory();
      }
    }
  };

  useScreenCapture();

  useEffect(() => {
    if (!currentStory) return;

    stopCurrentAnimation();
    setIsMediaLoading(true);
    progress.setValue(0);
    elapsedTimeRef.current = 0;
    videoLoadedRef.current = false;

    if (isVideoStory && player && mediaUri) {
      player.currentTime = 0;

      const loadTimeout = setTimeout(() => {
        if (!videoLoadedRef.current) {
          setIsMediaLoading(false);
          videoLoadedRef.current = true;
          if (!isPaused) {
            startStoryTimer(STORY_DURATION);
          }
        }
      }, 3000);

      return () => clearTimeout(loadTimeout);
    }

    return () => stopCurrentAnimation();
  }, [currentStoryIndex, currentUserIndex]);

  useEffect(() => {
    if (currentUser?.id) {
      preFetchNextUser(currentUser?.id as string);
    }
  }, [currentUser?.id, allUserIdsWithStories, allUsers]);

  useEffect(() => {
    if (isVideoStory) return;

    if (isPaused) {
      stopCurrentAnimation();
      elapsedTimeRef.current = progress.__getValue() * STORY_DURATION;
    } else if (!isMediaLoading) {
      const remainingTime = STORY_DURATION - elapsedTimeRef.current;
      startStoryTimer(remainingTime);
    }
  }, [isPaused, isVideoStory, isMediaLoading, progress, startStoryTimer]);

  // useEventListener(
  //   player,
  //   "timeUpdate",
  //   (payload: { currentTime: number; duration: number }) => {
  //     if (!isVideoStory || !payload) return;

  //     const { currentTime, duration } = payload;

  //     if (duration > 0) {
  //       const fraction = currentTime / duration;
  //       progress.setValue(fraction);

  //       if (isMediaLoading) {
  //         setIsMediaLoading(false);
  //         videoLoadedRef.current = true;
  //       }

  //       if (fraction >= 0.99) {
  //         goToNextStory();
  //       }
  //     }
  //   }
  // );

  // useEventListener(player, "playing", () => {
  //   if (isVideoStory && isMediaLoading) {
  //     setIsMediaLoading(false);
  //     videoLoadedRef.current = true;
  //   }
  // });

  // useEventListener(player, "load", (payload: any) => {
  //   if (isVideoStory && isMediaLoading && payload?.isLoaded) {
  //     setIsMediaLoading(false);
  //     videoLoadedRef.current = true;
  //   }
  // });

  // useEventListener(player, "playToEnd", () => {
  //   if (isVideoStory) {
  //     goToNextStory();
  //   }
  // });

  // useEventListener(player, "error", () => {
  //   setIsMediaLoading(false);
  //   videoLoadedRef.current = true;
  // });

  useEffect(() => {
    if (!isVideoStory || !player) return;

    if (isPaused || isMediaLoading) {
      player.pause();
    } else {
      player.play();
    }
  }, [isPaused, isMediaLoading, player, isVideoStory]);

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={Colors[theme].whiteText} />
    </View>
  );

  const ProfileInfo = () => (
    <View style={styles.profileContainer}>
      <Image
        key={`profile-${currentUser?.id}`}
        source={{
          uri: encodeImagePath(
            typeof currentUser?.profilePic === "string" &&
              currentUser.profilePic.includes("%2F")
              ? currentUser.profilePic.replace(/%2F/g, "/")
              : typeof currentUser?.profilePic === "string"
              ? currentUser.profilePic
              : ""
          ),
        }}
        style={styles.profileImage}
      />
      <View>
        <RnText style={styles.profileName}>{currentUser?.username}</RnText>
        <RnText style={styles.timestamp}>
          {formatTimeAgo(currentStory?.createdAt)}
        </RnText>
      </View>
    </View>
  );

  const ProgressBars = () => (
    <View style={styles.timelineContainer}>
      {currentStories && currentStories.length > 0 ? (
        currentStories.map((_: any, idx: number) => (
          <View key={idx} style={styles.timelineBarBg}>
            {idx < currentStoryIndex ? (
              <View style={styles.timelineBarFilled} />
            ) : idx === currentStoryIndex ? (
              <Animated.View
                style={[
                  styles.timelineBarFilled,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            ) : null}
          </View>
        ))
      ) : (
        <View style={styles.timelineBarBg}>
          <View />
        </View>
      )}
    </View>
  );

  const OverlayContainer = () => (
    <View style={styles.overlayContainer}>
      <ProgressBars />
      <ProfileInfo />
    </View>
  );

  return (
    <View style={styles.container}>
      {isVideoStory ? (
        <View style={{ flex: 1 }}>
          <View style={styles.videoContainer}>
            <VideoView
              style={styles.video}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          </View>
          <OverlayContainer />
          {isMediaLoading && <LoadingOverlay />}
        </View>
      ) : (
        <ImageBackground
          key={`${currentUser?.id}-${currentStoryIndex}-${mediaUri}`}
          source={{ uri: mediaUri }}
          style={styles.container}
          resizeMode="contain"
          onLoadStart={() => setIsMediaLoading(true)}
          onLoadEnd={() => {
            setIsMediaLoading(false);
            if (!isPaused) {
              startStoryTimer(STORY_DURATION);
            }
          }}
          onError={() => {
            setIsMediaLoading(false);
            setTimeout(() => goToNextStory(), 1000);
          }}
        >
          <OverlayContainer />
          {isMediaLoading && <LoadingOverlay />}
        </ImageBackground>
      )}

      <TouchableOpacity
        style={styles.touchOverlay}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleScreenPress}
      />
    </View>
  );
}
