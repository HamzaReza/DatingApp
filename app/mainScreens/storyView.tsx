/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/mainScreens/styles/storyView.styles";
import RnText from "@/components/RnText";
import { fetchStoriesForUser, getUserByUid } from "@/firebase/auth"; // your function
import { useScreenCapture } from "@/hooks/useScreenCapture";
import { encodeImagePath } from "@/utils";
import {
  collection,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
const STORY_DURATION = 4000;

export default function StoryView() {
  const {
    userId,
    username,
    profilePic,
    stories: storiesParam,
  } = useLocalSearchParams();
  const initialStories = JSON.parse(storiesParam as string);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [allUsers, setAllUsers] = useState([
    { id: userId, username, profilePic, stories: initialStories },
  ]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<number | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const isLongPressRef = useRef(false);

  const currentUser = allUsers[currentUserIndex];
  const currentStories = currentUser?.stories || [];
  const currentStory = currentStories[currentStoryIndex];

  const goToNextStory = async () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      const nextUserIndex = currentUserIndex + 1;
      const nextUser = allUsers[nextUserIndex];

      if (nextUser) {
        setCurrentUserIndex(nextUserIndex);
        setCurrentStoryIndex(0);
      } else {
        try {
          const nextUserId = await getNextUserIdFromBackend(
            currentUser.id as string
          );

          if (!nextUserId) {
            return router.back();
          }

          const fetched = await fetchStoriesForUser(nextUserId);

          if (fetched?.length > 0) {
            // Set up real-time listener for user data
            const unsubscribe = getUserByUid(nextUserId, nextUserData => {
              if (nextUserData) {
                const newUser = {
                  id: nextUserId,
                  username: nextUserData.name,
                  profilePic: nextUserData.photo,
                  stories: fetched,
                };

                setAllUsers(prev => [...prev, newUser]);
                setCurrentUserIndex(prev => prev + 1);
                setCurrentStoryIndex(0);

                // Clean up the listener after getting the data
                unsubscribe();
              }
            });
          } else {
            router.back();
          }
        } catch (e) {
          console.error("❌ Error fetching next user:", e);
          router.back();
        }
      }
    }
  };

  const getNextUserIdFromBackend = async (
    currentUserId: string
  ): Promise<string | null> => {
    try {
      const db = getFirestore();
      // 🔁 Example: get all users and find the next user by index
      const snapshot = await getDocs(collection(db, "users"));

      const allUsers = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const currentIndex = allUsers.findIndex(
        (user: any) => user.id === currentUserId
      );

      if (currentIndex !== -1 && currentIndex + 1 < allUsers.length) {
        const nextUser = allUsers[currentIndex + 1];
        return nextUser.id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("🔥 Error fetching next user ID:", error);
      return null;
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
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
      elapsedTimeRef.current = Date.now() - animationStartTimeRef.current;
    }, 500);
  };

  const handlePressOut = () => {
    longPressTimeoutRef.current && clearTimeout(longPressTimeoutRef.current);
    setIsPaused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsPaused(true);
    elapsedTimeRef.current = Date.now() - animationStartTimeRef.current;
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setIsPaused(false);
  };

  const forceInputBlur = () => {
    setMessage("");
    Keyboard.dismiss();
    setIsInputFocused(false);
    setIsPaused(false);
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
    progress.setValue(0);
    elapsedTimeRef.current = 0;
    animationStartTimeRef.current = Date.now();
    forceInputBlur();

    // Add this
    prefetchNextUserStories();
  }, [currentStoryIndex, currentUserIndex]);

  const prefetchNextUserStories = async () => {
    const nextIndex = currentUserIndex + 1;
    if (nextIndex < allUsers.length) {
      const nextUser = allUsers[nextIndex];
      if (!nextUser?.stories || nextUser.stories.length === 0) {
        const fetched = await fetchStoriesForUser(nextUser.id as string);
        const updatedUsers = [...allUsers];
        updatedUsers[nextIndex] = { ...nextUser, stories: fetched };
        setAllUsers(updatedUsers);
      }
    }
  };

  useEffect(() => {
    if (!isPaused && !isInputFocused) {
      progress.setValue(0);
      animationStartTimeRef.current = Date.now();

      const anim = Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION, // 5000 ms
        useNativeDriver: false,
      });

      anim.start();
      timeoutRef.current = setTimeout(goToNextStory, STORY_DURATION);

      return () => anim.stop(); // Clean up
    }
  }, [currentStoryIndex, currentUserIndex, isPaused, isInputFocused]);

  const imageUri = currentStory?.storyUrls?.[0] || null;

  return (
    <ImageBackground
      source={{ uri: encodeImagePath(imageUri) }}
      style={{ flex: 1 }}
      resizeMode="cover"
      onLoadStart={() => setIsImageLoading(true)}
      onLoadEnd={() => setIsImageLoading(false)}
    >
      <TouchableOpacity
        style={styles.storyTouchable}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleScreenPress}
      >
        <View>
          <View style={styles.timelineContainer}>
            {currentStories.map((_: any, idx: number) => (
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
            ))}
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: encodeImagePath(currentUser?.profilePic as string),
              }}
              style={styles.profileImage}
            />
            <RnText style={styles.profileName}>{currentUser?.username}</RnText>
          </View>
        </View>

        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inputWrapper}
        >
          <View style={styles.bottomView}>
            <RnInput
              value={message}
              onChangeText={setMessage}
              placeholder="Send message"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              containerStyle={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              style={styles.inputStyle}
              noError
            />
            <TouchableOpacity style={styles.sendButton}>
              <Feather name="send" size={25} color={Colors[theme].whiteText} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView> */}
      </TouchableOpacity>
      {isImageLoading && (
        <View>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ImageBackground>
  );
}
