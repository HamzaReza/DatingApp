import createStyles from "@/app/mainScreens/styles/storyView.styles";
import RnInput from "@/components/RnInput";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { fetchStoriesForUser } from "@/firebase/auth"; // your function
import { encodeImagePath } from "@/utils";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
const STORY_DURATION = 4000;

export default function StoryView() {
  const { userId, username, profilePic, stories: storiesParam } = useLocalSearchParams();
  const initialStories = JSON.parse(storiesParam as string);

  const colorScheme = "light"; // or useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [allUsers, setAllUsers] = useState([
    { id: userId, username, profilePic, stories: initialStories }
  ]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationStartTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const isLongPressRef = useRef(false);

  const currentUser = allUsers[currentUserIndex];
  const currentStories = currentUser?.stories || [];
  const currentStory = currentStories[currentStoryIndex];

  const startStoryTimer = (remainingTime = STORY_DURATION) => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(goToNextStory, remainingTime);
  };

  const startProgressAnimation = (elapsedTime = 0) => {
    const remainingTime = STORY_DURATION - elapsedTime;
    const progressValue = elapsedTime / STORY_DURATION;

    progress.setValue(progressValue);
    animationStartTimeRef.current = Date.now() - elapsedTime;

    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: remainingTime,
      useNativeDriver: false,
    });
    anim.start();
    return anim;
  };

  const goToNextStory = async () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < allUsers.length - 1) {
      const nextUserIndex = currentUserIndex + 1;
      let nextUser = allUsers[nextUserIndex];

      if (!nextUser.stories) {
        const fetched = await fetchStoriesForUser(nextUser.id);
        nextUser = { ...nextUser, stories: fetched };

        const updated = [...allUsers];
        updated[nextUserIndex] = nextUser;
        setAllUsers(updated);
      }

      setCurrentUserIndex(nextUserIndex);
      setCurrentStoryIndex(0);
    } else {
      router.back();
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

  useEffect(() => {
    progress.setValue(0);
    elapsedTimeRef.current = 0;
    animationStartTimeRef.current = Date.now();
    forceInputBlur();
  }, [currentStoryIndex, currentUserIndex]);

  useEffect(() => {
    if (!isPaused && !isInputFocused) {
      const anim = startProgressAnimation(elapsedTimeRef.current);
      startStoryTimer(STORY_DURATION - elapsedTimeRef.current);
      return () => anim.stop();
    }
  }, [currentStoryIndex, currentUserIndex, isPaused, isInputFocused]);

// Inside your StoryView component, before return
console.log("currentStory.image:", currentStory);
// console.log("encoded image path:", currentStory ? encodeImagePath(currentStory.image) : null);

console.log("currentUser.profilePic:", currentUser?.profilePic);
const imageUri = currentStory?.storyUrls?.[0] || null;


  return (
    <ImageBackground
      source={{ uri: encodeImagePath(imageUri) }}
      style={{ flex: 1 }}
      resizeMode="cover"
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
            {currentStories.map((_, idx) => (
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
              source={{ uri: encodeImagePath(currentUser?.profilePic) }}
              style={styles.profileImage}
            />
            <RnText style={styles.profileName}>{currentUser?.username}</RnText>
          </View>
        </View>

        <KeyboardAvoidingView
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
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ImageBackground>
  );
}
