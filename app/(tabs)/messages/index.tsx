import createStyles from '@/app/tabStyles/messages.styles';
import { MessageItem } from "@/components/MessageItem";
import PrimaryHeader from "@/components/PrimaryHeader";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

type RecentMatch = {
  id: string;
  name: string;
  image: string;
  likes?: number;
};

type Message = {
  id: string;
  name: string;
  message: string;
  time: string;
  image: string;
  isOnline: boolean;
  unread?: boolean;
};

const recentMatches: RecentMatch[] = [
  {
    id: "1",
    name: "Likes",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    likes: 32,
  },
  {
    id: "2",
    name: "Match 1",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    id: "3",
    name: "Match 2",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    id: "4",
    name: "Match 3",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
];

const messages: Message[] = [
  {
    id: "1",
    name: "Jessica Parker, 23",
    message: "What about that new jacket if I ...",
    time: "09:18",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOnline: true,
    unread: false,
  },
  {
    id: "2",
    name: "Clara Hazel",
    message: "I know right 😊",
    time: "12:44",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOnline: true,
    unread: false,
  },
  {
    id: "3",
    name: "Brandon Aminoff",
    message: "I've already registered, can't wai...",
    time: "08:06",
    image:
      "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOnline: true,
    unread: true,
  },
  {
    id: "4",
    name: "Amina Mina",
    message: "It will have two lines of heading ...",
    time: "09:32",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOnline: false,
    unread: true,
  },
  {
    id: "5",
    name: "Savanna Hall",
    message: "It will have two lines of heading ...",
    time: "06:21",
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
    isOnline: false,
    unread: true,
  },
];

export default function Messages() {

  const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? "dark" : "light";
    const styles = createStyles(theme);


  const handleBackPress = () => {
    router.back();
  };

  const handleCreateGroup = () => {
    router.push("/messages/connection/[id]", {
      
    });
  };

  const handleRecentMatchPress = (matchId: string) => {
    if (matchId === "1") {
      // Handle likes screen
      console.log("Open likes");
    } else {
      router.push(`/messages/chat/${matchId}`);
    }
  };

  const handleMessagePress = (messageId: string) => {
    router.push(`/messages/chat/${messageId}`);
  };

  const renderRecentMatch = ({ item }: { item: RecentMatch }) => (
    <TouchableOpacity
      style={styles.recentMatchItem}
      onPress={() => handleRecentMatchPress(item.id)}
    >
      <View style={styles.recentMatchImageContainer}>
        <Image source={{ uri: item.image }} style={styles.recentMatchImage} />
        {item.likes && (
          <View style={styles.likesOverlay}>
            <Ionicons name="heart" size={28} color={Colors[theme].whiteText} />
            <RnText style={styles.likesText}>{item.likes}</RnText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

 const renderMessage = ({ item }: { item: Message }) => (
  <MessageItem
    name={item.name}
    message={item.message}
    time={item.time}
    image={item.image}
    isOnline={item.isOnline}
    unread={item.unread}
    onPress={() => handleMessagePress(item.id)}
  />
);

  return (
      <SafeAreaView style={styles.container}>
<ImageBackground
  source={require('@/assets/images/rings.png')} // update the path to your PNG
  style={styles.gradientHeaderContainer}
  resizeMode="cover"
>
      <LinearGradient
        colors={[Colors[theme].primary, Colors[theme].pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 2 }}
         style={[StyleSheet.absoluteFill]}
      >
    
        <View style={{paddingHorizontal: wp(4)}}>
          <PrimaryHeader
            title="Messages"
            titleColor={Colors[theme].whiteText}
            leftIconColor={Colors[theme].whiteText}
            showRightIcon={false}
            borderWidth={0.5}
            leftIconSize={17}
            onLeftPress={handleBackPress}
          />
        </View>

        {/* Recent Matches Section */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <RnText style={styles.recentTitle}>Recent Matches</RnText>
            <TouchableOpacity 
              style={styles.createGroupButton}
              onPress={handleCreateGroup}
            >
              <RnText style={styles.createGroupText}>Create a Group</RnText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentMatches}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentMatch}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentMatchesList}
          />
        </View>
        
      </LinearGradient>
</ImageBackground>
      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        />
      </View>
    </SafeAreaView>
  );
}


