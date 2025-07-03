/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/mainScreens/styles/storyView.styles";
import RnInput from "@/components/RnInput";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const STORIES = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Jessica Parker",
  },
  {
    id: "2",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "John Doe",
  },
  {
    id: "3",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Clara Smith",
  },
];

const STORY_DURATION = 4000; // ms

export default function StoryView() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isLongPressRef = useRef(false);
  const animationStartTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);

  const startStoryTimer = (remainingTime: number = STORY_DURATION) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (current < STORIES.length - 1) {
        setCurrent(current + 1);
      } else {
        router.back();
      }
    }, remainingTime);
  };

  const startProgressAnimation = (elapsedTime: number = 0) => {
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

  useEffect(() => {
    elapsedTimeRef.current = 0;
    animationStartTimeRef.current = Date.now();
    setIsPaused(false);
    progress.setValue(0);
    forceInputBlur();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, [current]);

  useEffect(() => {
    if (!isPaused && !isInputFocused) {
      const anim = startProgressAnimation(elapsedTimeRef.current);
      startStoryTimer(STORY_DURATION - elapsedTimeRef.current);

      return () => {
        anim.stop();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [current, isPaused, isInputFocused]);

  const handleStoryNavigation = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (current < STORIES.length - 1) {
        setCurrent(current + 1);
      } else {
        router.back();
      }
    } else if (direction === "prev" && current > 0) {
      setCurrent(current - 1);
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
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (isPaused) {
      setIsPaused(false);
    }
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
    setIsInputFocused(false);
    setIsPaused(false);
    setMessage("");
    Keyboard.dismiss();
  };

  const handlePress = (e: any) => {
    if (!isLongPressRef.current) {
      const { locationX } = e.nativeEvent;
      if (locationX < Dimensions.get("window").width / 2) {
        handleStoryNavigation("prev");
      } else {
        handleStoryNavigation("next");
      }
    }

    isLongPressRef.current = false;
  };

  return (
    <ImageBackground
      source={{ uri: STORIES[current].image }}
      imageStyle={styles.storyImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.storyTouchable}
      >
        <View>
          <View style={styles.timelineContainer}>
            {STORIES.map((_, idx) => (
              <View key={idx} style={styles.timelineBarBg}>
                {idx < current ? (
                  <View style={styles.timelineBarFilled} />
                ) : idx === current ? (
                  <Animated.View
                    key={`progress-${current}`}
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
              source={{ uri: STORIES[current].profile }}
              style={styles.profileImage}
            />
            <RnText style={styles.profileName}>{STORIES[current].name}</RnText>
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
              noError={true}
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
