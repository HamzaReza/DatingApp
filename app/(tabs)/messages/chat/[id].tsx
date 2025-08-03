/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/tabStyles/chat.styles";
import RnInput from "@/components/RnInput";
import RnModal from "@/components/RnModal";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { getUserByUid } from "@/firebase/auth";
import {
  checkAndUpdateMessageLimit,
  checkIfMeetRejected,
  sendDirectMessage,
  sendGroupMessage,
  setupDirectMessageListener,
  setupGroupMessagesListener,
} from "@/firebase/message";
import { RootState } from "@/redux/store";
import { encodeImagePath, hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
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
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { GroupMessage } from "../types";

export default function Chat() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { user } = useSelector((state: RootState) => state.user);
  const { id, matchId, otherUserId, chatType } = useLocalSearchParams();
  const groupId = Array.isArray(id) ? id[0] : id;

  const [message, setMessage] = useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const [group, setGroup] = useState<any>(null);
  const [usersName, setUsersName] = useState<any[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [showMemberList, setShowMemberList] = useState(false);
  const [reciverData, setReciverData] = useState<any>(null);

  const isSingleChat = chatType === "single";
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const [statusMessage, setStatusMessage] = useState<any>(null);
  const [meetDataModalVisible, setMeetDataModalVisible] = useState(false);

  useEffect(() => {
    console.log(statusMessage);
  }, [statusMessage]);

  useEffect(() => {
    if (isSingleChat) {
      const unsubscribe = setupRealtimeChatStatus(
        matchId as string,
        (status: any) => {
          setStatusMessage(status);
        }
      );

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [matchId, user?.uid]);

  useEffect(() => {
    if (isSingleChat) {
      const fetchRejection = async () => {
        const rejection = await checkIfMeetRejected(matchId, user?.uid);
      };

      fetchRejection();
    }
  }, [matchId]);

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
          groupData?.users.map(async (user: any) => {
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
  }, [groupId]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (isSingleChat) {
      unsubscribe = setupDirectMessageListener(
        matchId as string,
        (messages: any) => {
          setMessages(messages);
        }
      );
    } else {
      unsubscribe = setupGroupMessagesListener(id as string, group => {
        setMessages(group.messages || []);
      });
    }

    return () => unsubscribe();
  }, [id, isSingleChat, user?.uid]);
  useEffect(() => {
    if (!group || !group.users) return;

    const getAcceptedUsersString = (users: any) => {
      return users
        .filter((i: any) => i.status === "accepted")
        .map((c: any) => (c.uid === user?.uid ? "You" : c.name))
        .join(", ");
    };

    const acceptedUsers = getAcceptedUsersString(group.users);

    setUsersName(acceptedUsers);
  }, [group]);

  const handleMorePress = () => {
    console.log("More options");
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.uid) return;

    try {
      if (isSingleChat) {
        const messageCount = await checkAndUpdateMessageLimit(
          matchId as string,
          user?.uid
        );

        if (messageCount > 5) {
          Alert.alert(
            "Limit Reached",
            "Messages are finished. Please pay now to meet.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Pay Now",
                onPress: () =>
                  router.push("/eventScreens/tickets/paymentScreen"),
              },
            ]
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
            "Messages are finished. Please pay now to meet.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Pay Now",
                onPress: () =>
                  router.push("/eventScreens/tickets/paymentScreen"),
              },
            ]
          );
        }

        await sendDirectMessage(matchId as string, user?.uid, message);
      } else {
        await sendGroupMessage({
          senderId: user?.uid,
          groupId: id as string,
          content: message,
          messageType: "text",
        });
      }

      setMessage("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send message");
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
    if (!groupId || !user?.uid) return;

    try {
      const db = getFirestore();
      const groupRef = doc(db, "messages", groupId);
      const userInGroup = group?.users?.find((i: any) => i.uid === user?.uid);

      if (!userInGroup) {
        Alert.alert("Error", "User not found in group");
        return;
      }

      await updateDoc(groupRef, {
        users: arrayRemove(userInGroup),
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
      // Set up real-time listener for receiver data
      unsubscribe = getUserByUid(otherUserId as string, userData => {
        if (userData) {
          setReciverData(userData); // Save to state to show name/photo etc.
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [matchId, isSingleChat, otherUserId]);

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isOwn = item.senderId === user?.uid;

    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const directData = new Date(
      item.timestamp.seconds * 1000 + item.timestamp.nanoseconds / 1000000
    );

    const finalDirectDate = directData.toLocaleString();

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

  const setupRealtimeChatStatus = (groupId: any, callback: any) => {
    const db = getFirestore();
    const meetRef = collection(db, "messages", groupId, "meet");

    const unsubscribe = onSnapshot(meetRef, meetSnap => {
      // First check if meet subcollection exists at all
      if (meetSnap.empty) {
        callback(null);
        return;
      }

      try {
        const docs = meetSnap.docs;
        const hasConfirm = docs.some((doc: any) => doc.id === "confirm");
        const hasRejected = docs.some((doc: any) => doc.id === "rejected");

        // Check for confirmation first
        if (hasConfirm) {
          const confirmDoc = docs.find((doc: any) => doc.id === "confirm");
          callback({
            type: "button",
            label: "View Meeting Details",
            finalData: confirmDoc?.data(),
          });
          return;
        }

        // Check for rejections
        if (hasRejected) {
          const rejectedDoc = docs.find((doc: any) => doc.id === "rejected");
          const rejectionData = rejectedDoc?.data();

          callback({
            type: "text",
            message:
              rejectionData?.userId === user?.uid
                ? "You declined the meeting preferences"
                : "The other person declined your meeting preferences",
          });
          return;
        }

        // If there are any other docs (user preferences)
        if (docs.length > 0) {
          callback({
            type: "text",
            message: "Discussing meeting preferences",
          });
          return;
        }

        callback(null);
      } catch (error) {
        console.error("Error in realtime status update:", error);
        callback(null);
      }
    });

    return unsubscribe;
  };
  const handleDetailsPress = () => {
    console.log("hi");
    setMeetDataModalVisible(!meetDataModalVisible);
  };

  const handleMeetPress = () => {
    router.push(`/meet/${matchId}`);
  }; // navigate to meet setup screen

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
              {!isSingleChat ? (
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
              ) : statusMessage?.label === "View Meeting Details" ? null : (
                <TouchableOpacity
                  onPress={handleMeetPress} // navigate to meet setup screen
                >
                  <MaterialIcons
                    name="video-call"
                    size={20}
                    color={Colors[theme].greenText}
                  />
                </TouchableOpacity>
              )}
            </View>

            {isSingleChat && (
              <>
                {statusMessage?.type === "text" && (
                  <RnText style={teststyles.text}>
                    {statusMessage.message}
                  </RnText>
                )}

                {statusMessage?.type === "button" && (
                  <TouchableOpacity
                    onPress={handleDetailsPress}
                    style={teststyles.finalButton}
                  >
                    <RnText style={teststyles.finalText}>
                      {statusMessage.label}
                    </RnText>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Date Separator */}

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

              {group?.users?.map((c: any) => (
                <View key={c.uid} style={styles.memberItem}>
                  <Image
                    source={{ uri: c.photo }}
                    style={styles.memberAvatar}
                  />
                  <View style={styles.memberInfo}>
                    <RnText style={styles.memberName}>
                      {c?.uid === group.invitedBy ? "You" : c.name}
                      {c?.uid === group.invitedBy && " (Admin)"}
                    </RnText>
                    <RnText
                      style={[
                        styles.memberStatus,
                        { color: Colors[theme].primary },
                      ]}
                    >
                      {c.status}
                    </RnText>
                  </View>

                  {c?.uid === group.invitedBy && c.uid !== user?.uid && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveUser(c)}
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
              {user?.uid !== group?.invitedBy && (
                <TouchableOpacity
                  style={styles.leftButton}
                  onPress={handleLeaveGroup}
                >
                  <RnText style={styles.leftText}>Leave group</RnText>
                </TouchableOpacity>
              )}
            </View>
          </RnModal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={meetDataModalVisible}
            onRequestClose={() => setMeetDataModalVisible(false)}
          >
            <View style={teststyles.modalBackground}>
              <View style={teststyles.modalContainer}>
                <RnText style={teststyles.modalTitle}>
                  Final Meet Details
                </RnText>

                <RnText style={teststyles.modalText}>
                  Location: {statusMessage?.finalData?.finalPlace}
                </RnText>
                <RnText style={teststyles.modalText}>
                  Date: {statusMessage?.finalData?.finalDate}
                </RnText>
                <RnText style={teststyles.modalText}>
                  Time: {statusMessage?.finalData?.finalTime}
                </RnText>

                <TouchableOpacity
                  onPress={() => setMeetDataModalVisible(false)}
                  style={teststyles.modalCloseButton}
                >
                  <RnText style={teststyles.modalCloseText}>Close</RnText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const teststyles = StyleSheet.create({
  finalButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: Borders.radius3,
    alignSelf: "center",
    marginVertical: hp(2),
  },
  finalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: Colors.dark.primary,
    textAlign: "center",
    fontSize: FontSize.small,
    marginHorizontal: wp(1.5),
    fontFamily: FontFamily.bold,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
  },
});
