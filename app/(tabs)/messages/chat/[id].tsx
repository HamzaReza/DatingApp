import createStyles from "@/app/tabStyles/chat.styles";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import {
  checkAndUpdateMessageLimit,
  sendDirectMessage,
  sendGroupMessage,
  sendOneToOneMessage,
  setupDirectMessageListener,
  setupGroupMessagesListener,
} from "@/firebase/message";
import { encodeImagePath, hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@react-native-firebase/firestore";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler as RNGHPanGestureHandler,
} from "react-native-gesture-handler";
import { GroupMessage } from "../types";
import RnModal from "@/components/RnModal";
import { getUserByUid } from "@/firebase/auth";

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
  const currentUserId = getAuth().currentUser?.uid;
  const { id, matchId, otherUserId, chatType } = useLocalSearchParams();
  const groupId = Array.isArray(id) ? id[0] : id;

  const [message, setMessage] = useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const gestureRef = useRef<RNGHPanGestureHandler>(null);
  const [group, setGroup] = useState<any>(null);
  const [usersName, setUsersName] = useState<any[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMemberList, setShowMemberList] = useState(false);
  const [reciverData, setReceiverData] = useState([]);
  const isSingleChat = chatType === "single";
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (messages) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useLayoutEffect(() => {
    const parentNav = navigation.getParent();
    const originalStyle = {
      borderWidth: 0,
      borderTopWidth: 0,
      backgroundColor: Colors[theme].bottomTab,
      height: hp(8),
      marginHorizontal: wp(4),
      marginBottom: hp(2),
      borderRadius: Borders.radius4,
      position: "absolute",
    };

    parentNav?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parentNav?.setOptions({
        tabBarStyle: originalStyle,
      });
    };
  }, [navigation]);

  useEffect(() => {
    const fetchGroupWithUsers = async () => {
      if (isSingleChat) {
        return;
      }

      const db = getFirestore();
      const docRef = doc(db, "messages", groupId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const groupData = docSnap.data();

        // Fetch user details for each user in the group
        const usersWithDetails = await Promise.all(
          groupData.users.map(async (user: any) => {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userDetails = userSnap.data();
              return {
                ...user,
                ...userDetails, // includes 'photo', 'name', etc.
              };
            } else {
              return user; // fallback to original user if not found
            }
          })
        );

        setGroup({ ...groupData, users: usersWithDetails });
      } else {
        console.log("No such group!");
      }
    };

    if (groupId) fetchGroupWithUsers();
    console.log(group, "group");
  }, [groupId]);

  const groupMessagesByDate = (messages: GroupMessage[]) => {
    const grouped: { [date: string]: GroupMessage[] } = {};

    messages.forEach(message => {
      const dateKey = formatMessageDate(message.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });

    return grouped;
  };

  // Format date for display
  const formatMessageDate = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Update your message listener
  useEffect(() => {
    let unsubscribe: () => void;

    if (isSingleChat) {
      // 1:1 chat listener
      unsubscribe = setupDirectMessageListener(matchId, messages => {
        setMessages(messages);
        setLoading(false);

        // Mark messages as read when opened
        // if (currentUserId) {
        //   markMessagesAsRead(id, currentUserId);
        // }
      });
    } else {
      // Group chat listener (your existing code)
      unsubscribe = setupGroupMessagesListener(id, group => {
        setMessages(group.messages || []);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, [id, isSingleChat, currentUserId]);
  useEffect(() => {
    if (!group || !group.users) return;

    const getAcceptedUsersString = (users: any, currentUserId: any) => {
      return users
        .filter((user: any) => user.status === "accepted")
        .map((user: any) => (user.uid === currentUserId ? "You" : user.name))
        .join(", ");
    };

    const acceptedUsers = getAcceptedUsersString(
      group.users,
      getAuth().currentUser?.uid
    );

    setUsersName(acceptedUsers);
  }, [group]);

  const namesString = group?.users.map((user: any) => user.name).join(", ");

  const handleMorePress = () => {
    console.log("More options");
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUserId) return;

    try {
      if (isSingleChat) {
        const participants = matchId.split("_");
        const receiverId = participants.find(id => id !== currentUserId);

        const messageCount = await checkAndUpdateMessageLimit(
          matchId,
          currentUserId
        );

        if (messageCount > 5) {
          Alert.alert(
            "Limit Reached",
            "Your free messages are finished. Please pay now."
          );
          return;
        }

        // ✅ Show alert only if messageCount is 3, 4 or 5
        const messagesLeft = 5 - messageCount;
        if (messageCount >= 3 && messageCount <= 5 && messagesLeft > 0) {
          Alert.alert("Message Sent", `${messagesLeft} messages left`);
        } else if (messageCount === 5) {
          Alert.alert(
            "Limit Reached",
            "Your free messages are finished. Please pay now."
          );
        }

        await sendDirectMessage(matchId, currentUserId, message);
      } else {
        await sendGroupMessage({
          senderId: currentUserId,
          groupId: id,
          content: message,
          messageType: "text",
        });
      }

      setMessage("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send message");
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

  const handleLeaveGroup = () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Leave",
        onPress: confirmLeaveGroup,
        style: "destructive",
      },
    ]);
  };

  const confirmLeaveGroup = async () => {
    if (!groupId || !currentUserId) return;

    try {
      const db = getFirestore();
      const groupRef = doc(db, "messages", groupId);
      const currentUser = group?.users?.find(
        (u: any) => u.uid === currentUserId
      );

      if (!currentUser) {
        Alert.alert("Error", "User not found in group");
        return;
      }

      await updateDoc(groupRef, {
        users: arrayRemove(currentUser),
      });

      Alert.alert("Success", "You have left the group");
      router.back(); // Navigate back after leaving
    } catch (error) {
      console.error("Error leaving group:", error);
      Alert.alert("Error", "Failed to leave group");
    }
  };

  const handleRemoveUser = (user: any) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${user.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => confirmRemoveUser(user),
          style: "destructive",
        },
      ]
    );
  };

  const confirmRemoveUser = async (user: any) => {
    try {
      const db = getFirestore();
      const groupRef = doc(db, "messages", groupId);

      await updateDoc(groupRef, {
        users: arrayRemove(user),
      });

      Alert.alert("Success", `${user.name} has been removed from the group`);
    } catch (error) {
      console.error("Error removing user:", error);
      Alert.alert("Error", "Failed to remove user");
    }
  };

  const formatTimestamp = (timestamp: any) => {
    // Handle both Firestore Timestamp and ISO string
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    let unsubscribe: () => void;

    if (isSingleChat) {
      // Fetch receiver data separately
      getUserByUid(otherUserId).then(userData => {
        if (userData) {
          setReceiverData(userData); // Save to state to show name/photo etc.
        }
      });
    }
  }, [matchId, isSingleChat, otherUserId]);

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isOwn = item.senderId === currentUserId;
    console.log(item.timestamp);
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const directData = new Date(
      item.timestamp.seconds * 1000 + item.timestamp.nanoseconds / 1000000
    );

    const finalDirectDate = directData.toLocaleString();
    console.log("finalDirectDate", finalDirectDate);

    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View>
          <RnText>{item.senderName}</RnText>
        </View>

        <View>
          <View
            style={[
              styles.messageBubble,
              isOwn ? styles.ownBubble : styles.otherBubble,
            ]}
          >
            <RnText
              style={[
                styles.messageText,
                isOwn ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {item.content}
            </RnText>
          </View>
          {isSingleChat ? (
            <RnText style={styles.messageTime}>{finalDirectDate}</RnText>
          ) : (
            <RnText style={styles.messageTime}>{time}</RnText>
          )}
        </View>
      </View>
    );
  };

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
            overflow: "hidden",
          },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? hp(3) : 0}
        >
          <ScrollContainer
            customStyle={{ flex: 1, paddingHorizontal: 0, paddingBottom: 0 }}
          >
            {/* Header */}

            <View style={styles.chatHeaderGradient}>
              <View style={styles.userInfo}>
                <RoundButton
                  iconName="chevron-left"
                  iconSize={25}
                  iconColor={Colors[theme].primary}
                  backgroundColour={Colors[theme].whiteText}
                  onPress={() => router.back()}
                />
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: group?.image || encodeImagePath(reciverData.photo),
                    }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.avatarBorder} />
                </View>
                <View style={styles.userDetails}>
                  <RnText style={styles.userName}>
                    {group?.groupName || reciverData?.name}
                  </RnText>
                  <RnText style={styles.userStatus}>{usersName}</RnText>
                </View>
              </View>
              {!isSingleChat && (
                <TouchableOpacity
                  onPress={handleMorePress}
                  style={styles.headerIconButton}
                >
                  <MaterialIcons
                    name="more-vert"
                    size={22}
                    color={Colors[theme].blackText}
                    onPress={() => setShowMemberList(true)}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* Date Separator */}
            <View style={styles.dateSeparator}>
              <View style={styles.dateLine} />
              <RnText style={styles.dateText}>Today</RnText>
              <View style={styles.dateLine} />
            </View>

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
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
                style={{
                  fontSize: FontSize.small,
                  color: Colors[theme].blackText,
                }}
                containerStyle={{
                  flex: 1,
                  marginRight: wp(3),
                  marginBottom: 0,
                }}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: Colors[theme].gray,
                  borderRadius: Borders.radius3,
                  paddingHorizontal: wp(4),
                  minHeight: hp(6),
                  backgroundColor: Colors[theme].background,
                }}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <MaterialIcons
                  name="send"
                  size={20}
                  color={Colors[theme].pink}
                />
              </TouchableOpacity>
            </View>
          </ScrollContainer>
          <RnModal
            show={showMemberList}
            backButton={() => setShowMemberList(false)}
            backDrop={() => setShowMemberList(false)}
          >
            <View style={styles.memberModalContainer}>
              <RnText style={styles.memberModalTitle}>Group Members</RnText>

              {group?.users?.map((user: any) => (
                <View key={user.uid} style={styles.memberItem}>
                  <Image
                    source={{ uri: user.photo }}
                    style={styles.memberAvatar}
                  />
                  <View style={styles.memberInfo}>
                    <RnText style={styles.memberName}>
                      {currentUserId === group.invitedBy ? "You" : user.name}
                      {currentUserId === group.invitedBy && " (Admin)"}
                    </RnText>
                    <RnText
                      style={[
                        styles.memberStatus,
                        { color: Colors[theme].primary },
                      ]}
                    >
                      {user.status}
                    </RnText>
                  </View>

                  {currentUserId === group.invitedBy &&
                    user.uid !== currentUserId && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveUser(user)}
                      >
                        <MaterialIcons
                          name="person-remove"
                          size={24}
                          color={Colors[theme].redText}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              ))}
              {currentUserId !== group?.invitedBy && (
                <TouchableOpacity
                  style={styles.leftButton}
                  onPress={handleLeaveGroup}
                >
                  <RnText style={styles.leftText}>Leave group</RnText>
                </TouchableOpacity>
              )}
            </View>
          </RnModal>
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
