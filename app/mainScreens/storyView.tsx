import createStyles from "@/app/mainScreens/styles/storyView.styles";
import Container from "@/components/RnContainer";
import RnInput from "@/components/RnInput";
import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
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
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    anim.start();

    const timeout = setTimeout(() => {
      if (current < STORIES.length - 1) {
        setCurrent(current + 1);
      } else {
        router.back();
      }
    }, STORY_DURATION);

    return () => {
      anim.stop();
      clearTimeout(timeout);
    };
  }, [current]);

  const handlePress = (direction: "next" | "prev") => {
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

  return (
    <Container customStyle={styles.container}>
      {/* Timeline Bar */}
      <View style={styles.timelineContainer}>
        {STORIES.map((_, idx) => (
          <View key={idx} style={styles.timelineBarBg}>
            {idx < current ? (
              <View style={styles.timelineBarFilled} />
            ) : idx === current ? (
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

      {/* Profile image and name */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: STORIES[current].profile }}
          style={styles.profileImage}
        />
        <RnText style={styles.profileName}>{STORIES[current].name}</RnText>
      </View>

      {/* Story Image */}
      <TouchableOpacity
        style={styles.storyTouchable}
        activeOpacity={1}
        onPress={(e) => {
          const { locationX } = e.nativeEvent;
          if (locationX < Dimensions.get("window").width / 2) {
            handlePress("prev");
          } else {
            handlePress("next");
          }
        }}
      >
        <Image
          source={{ uri: STORIES[current].image }}
          style={styles.storyImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Message Input at Bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <RnInput
            value={message}
            onChangeText={setMessage}
            placeholder="Send message"
            containerStyle={{ flex: 1, marginRight: wp(2), marginBottom: 0 }}
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: Colors[theme].gray,
              borderRadius: Borders.radius2,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              height: hp(6),
            }}
            style={{ color: Colors[theme].whiteText }}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Feather name="send" size={25} color={Colors[theme].whiteText} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
