import createStyles from "@/app/tabStyles/messages.styles";
import { MessageItem } from "@/components/MessageItem";
import RnBottomSheet from "@/components/RnBottomSheet";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { sendGroupInvites } from "@/firebase/auth";
import { encodeImagePath } from "@/utils";
import getDistanceFromLatLonInMeters, {
  getNearbyHangoutUsers,
} from "@/utils/Distance";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import {
  Accuracy,
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
} from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
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

  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
  const [nearbyUsers, setNearbyUsers] = React.useState<Message[]>([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
    console.log(selectedUsers);
  }, [selectedUsers]);

  const handleCreateGroup = async () => {
    const { status } = await getForegroundPermissionsAsync();
    if (status !== "granted") return;

    const location = await getCurrentPositionAsync({
      accuracy: Accuracy.Highest,
    });

    const users = await fetchNearbyUsers(
      location.coords.latitude,
      location.coords.longitude
    );

    setNearbyUsers(users);
    setIsBottomSheetVisible(true);
  };

  const fetchNearbyUsers = async (
    currentLatitude: number,
    currentLongitude: number
  ) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const nearbyUsers: any[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const userLocation = data.location; // Assume this is { latitude: number, longitude: number }

      if (userLocation?.latitude && userLocation?.longitude) {
        const distance = getDistanceFromLatLonInMeters(
          currentLatitude,
          currentLongitude,
          userLocation.latitude,
          userLocation.longitude
        );

        if (distance <= 10000) {
          // 10 km = 10,000 meters
          nearbyUsers.push({
            id: doc.id,
            ...data,
          });
        }
      }
    });

    return nearbyUsers;
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

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        // If already selected, remove it
        return prevSelected.filter(id => id !== userId);
      } else {
        // If not selected, add it
        return [...prevSelected, userId];
      }
    });
  };

  const handleSendRequests = async () => {
    try {
      const invitedBy = getAuth().currentUser?.uid;
      const groupId = `group_${Date.now()}`; // or generate based on logic
   

      await sendGroupInvites(invitedBy, selectedUsers);

      setIsBottomSheetVisible(false);
      setSelectedUsers([]);

      console.log("✅ Group invite requests sent.");
    } catch (err) {
      console.error("❌ Error sending group invites:", err);
    }
  };

  return (
    <Container customStyle={styles.container}>
      <View style={styles.gradientHeaderContainer}>
        <LinearGradient
          colors={[Colors[theme].primary, Colors[theme].pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 2 }}
          style={[StyleSheet.absoluteFill]}
        >
          <View style={styles.headerContainer}>
            <RoundButton noShadow />
            <RnText style={styles.headerTitle}>Messages</RnText>
            <RoundButton
              iconName="tv"
              iconSize={22}
              iconColor={Colors[theme].primary}
              backgroundColour={Colors[theme].whiteText}
              onPress={async () => {
                let { status } = await getForegroundPermissionsAsync();
                if (status === "granted") {
                  const location = await getCurrentPositionAsync({
                    accuracy: Accuracy.Highest,
                  });
                  router.push({
                    pathname: "/eventScreens/explore",
                    params: {
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    },
                  });
                }
              }}
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
              keyExtractor={item => item.id}
              renderItem={renderRecentMatch}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentMatchesList}
            />
          </View>
        </LinearGradient>
      </View>
      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        />
      </View>
      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        snapPoints={["50%"]}
      >
        <View style={styles.bottomSheetHeader}>
          <RnText
            style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
          >
            Nearby Users
          </RnText>
          {selectedUsers.length > 0 && (
            <TouchableOpacity
              style={styles.createGroupButton}
              onPress={handleSendRequests}
            >
              <RnText style={styles.createGroupText}>Request to join</RnText>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={nearbyUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageItem
              name={item.name}
              message={item.bio || "Hi there!"} // Use bio or default message
              time={""} // You might want to remove time in selection mode
              image={encodeImagePath(item.photo)}
              isOnline={item.isOnline}
              unread={false} // Not relevant in selection mode
              onPress={() => handleSelectUser(item.id)}
              isSelected={selectedUsers.includes(item.id)}
              showCheckbox={isBottomSheetVisible} // Only show checkbox in bottom sheet
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </RnBottomSheet>
    </Container>
  );
}
