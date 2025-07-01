import createStyles from '@/app/tabStyles/chat.styles';
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler as RNGHPanGestureHandler,
} from "react-native-gesture-handler";


const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
};

const chatMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Where are loem",
    time: "10:25",
    isOwn: true,
  },
  {
    id: "2",
    text: "Loem isn't here",
    time: "10:23",
    isOwn: false,
  },
  {
    id: "3",
    text: "Lorem Ipsum Here Doing",
    time: "10:25",
    isOwn: true,
  },
  {
    id: "4",
    text: "Lorem Ipsum Nothing",
    time: "10:23",
    isOwn: false,
  },
];

export default function Chat() {

const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const gestureRef = useRef<RNGHPanGestureHandler>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleMorePress = () => {
    console.log("More options");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === 4) {
      // ACTIVE
      const { translationY, velocityY } = event.nativeEvent;

      if (translationY > 100 || velocityY > 500) {
        // Close modal
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          router.back();
        });
      } else {
        // Snap back
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <RnText
          style={[
            styles.messageText,
            item.isOwn ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </RnText>
      </View>
      <RnText style={styles.messageTime}>{item.time}</RnText>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors[theme].primary}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Drag Handle */}
        <RNGHPanGestureHandler
          ref={gestureRef}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </Animated.View>
        </RNGHPanGestureHandler>

        {/* Chat Content */}
        <ScrollContainer
          customStyle={{ flex: 1, paddingHorizontal: 0, paddingBottom: 0 }}
        >
          {/* Header */}

          <View style={styles.chatHeaderGradient}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                  }}
                  style={styles.userAvatar}
                />
                <View style={styles.avatarBorder} />
              </View>
              <View style={styles.userDetails}>
                <RnText style={styles.userName}>Jessica Parker, 23</RnText>
                <RnText style={styles.userStatus}>Online</RnText>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleMorePress}
              style={styles.headerIconButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color={Colors[theme].blackText}
              />
            </TouchableOpacity>
          </View>
          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <RnText style={styles.dateText}>Today</RnText>
            <View style={styles.dateLine} />
          </View>

          {/* Messages List */}
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <RnInput
              value={message}
              onChangeText={setMessage}
              placeholder="Send message"
              style={{ fontSize: FontSize.small, color: Colors[theme].blackText }}
              containerStyle={{ flex: 1, marginRight: wp(3), marginBottom: 0 }}
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: Colors[theme].gray,
                borderRadius: wp(6),
                paddingHorizontal: wp(4),
                minHeight: hp(6),
                backgroundColor: Colors[theme].background,
              }}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Feather name="send" size={20} color={Colors[theme].pink} />
            </TouchableOpacity>
          </View>
        </ScrollContainer>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

