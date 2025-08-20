/* eslint-disable react-hooks/exhaustive-deps */
import createStyles, {
  paymentStyles,
  uiStyles,
} from "@/app/tabStyles/chat.styles";
import RnButton from "@/components/RnButton";
import RnInput from "@/components/RnInput";
import RnModal from "@/components/RnModal";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { getUserByUid } from "@/firebase/auth";
import {
  checkAndUpdateMessageLimit,
  checkMessageLimit,
  sendDirectMessage,
  sendGroupMessage,
  setupDirectMessageListener,
  setupGroupMessagesListener,
} from "@/firebase/message";
import { checkBothUsersPaid, onOtherUserPaidChange } from "@/firebase/stripe";
import { useScreenCapture } from "@/hooks/useScreenCapture";
import { RootState } from "@/redux/store";
import { GroupMessage } from "@/types/Messages";
import { encodeImagePath, hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

// Timer component for payment countdown
const PaymentTimer = ({
  matchId,
  theme,
  styles,
  currentUserId,
}: {
  matchId: string;
  theme: string;
  styles: any;
  currentUserId: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [otherUserPaid, setOtherUserPaid] = useState(false);

  useEffect(() => {
    const db = getFirestore();

    // Real-time listener for match payments to check if other user has paid
    const unsubscribeMatchPayments = onOtherUserPaidChange(
      matchId,
      currentUserId,
      otherUserPaid => {
        setOtherUserPaid(otherUserPaid);
      }
    );

    // Real-time listener for payment expiry time
    const paymentsRef = collection(db, "payments");
    const paymentsQuery = query(
      paymentsRef,
      where("matchId", "==", matchId),
      where("status", "==", "paid")
    );

    const unsubscribePayments = onSnapshot(
      paymentsQuery,
      snapshot => {
        if (!snapshot.empty) {
          // Get the single active payment expiry time
          const paymentDoc = snapshot.docs[0]; // Only one active payment per match
          const paymentData = paymentDoc.data();
          const expiryTime = paymentData.expiresAt?.toDate();

          if (expiryTime) {
            const updateTimer = () => {
              const now = new Date();
              const diff = expiryTime.getTime() - now.getTime();

              if (diff <= 0) {
                setTimeLeft(0);
              } else {
                setTimeLeft(Math.floor(diff / 1000));
              }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);

            // Clean up interval when component unmounts or payment changes
            return () => clearInterval(interval);
          }
        }
      },
      error => {
        console.error("Error listening to payments:", error);
      }
    );

    // Cleanup both listeners
    return () => {
      unsubscribeMatchPayments();
      unsubscribePayments();
    };
  }, [matchId, currentUserId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Only render timer if other user has paid
  if (!otherUserPaid) {
    return null;
  }

  return (
    <View style={styles.timerContainer}>
      <RnText style={styles.timerLabel}>
        ⏰ Other user has paid! You have:
      </RnText>
      <RnText
        style={[
          styles.timerText,
          { color: Colors[theme as keyof typeof Colors].primary },
        ]}
      >
        {formatTime(timeLeft)}
      </RnText>
      <RnText style={styles.timerLabel}>
        to pay, or the first user gets refunded
      </RnText>
    </View>
  );
};

export default function Chat() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const paymentStyleSheet = paymentStyles(theme);
  const uiStyleSheet = uiStyles(theme);
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
  const [meetConfirm, setMeetConfirm] = useState(false);
  const [bothUsersPaid, setBothUsersPaid] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [messageLimitReached, setMessageLimitReached] = useState(false);
  const [eventHasPassed, setEventHasPassed] = useState(false);

  const isSingleChat = chatType === "single";
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const [statusMessage, setStatusMessage] = useState<any>(null);
  const [meetDataModalVisible, setMeetDataModalVisible] = useState(false);

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

  useScreenCapture();

  // Check payment status and message limit when component mounts
  useFocusEffect(
    useCallback(() => {
      const checkPaymentStatus = async () => {
        if (isSingleChat && matchId) {
          try {
            const paid = await checkBothUsersPaid(matchId as string);
            setBothUsersPaid(paid);

            // Also check if current user has paid
            const db = getFirestore();
            const userPaymentQuery = query(
              collection(db, "payments"),
              where("userId", "==", user?.uid),
              where("matchId", "==", matchId),
              where("status", "in", ["paid", "completed"])
            );

            const userPaymentSnapshot = await getDocs(userPaymentQuery);

            setUserHasPaid(!userPaymentSnapshot.empty);

            // Check current message count to see if limit is already reached
            if (!paid) {
              try {
                const messageCount = await checkMessageLimit(
                  matchId as string,
                  user?.uid
                );

                setMessageLimitReached(messageCount >= 5);
              } catch (error) {
                console.error("Error checking message limit:", error);
                setMessageLimitReached(false);
              }
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
            setBothUsersPaid(false);
            setUserHasPaid(false);
          }
        }
      };

      checkPaymentStatus();
    }, [matchId, isSingleChat, user?.uid])
  );

  // Realtime refresh when both users have paid
  useEffect(() => {
    if (!isSingleChat || !matchId) return;

    const db = getFirestore();
    const paymentsRef = collection(db, "payments");
    const paymentsQuery = query(
      paymentsRef,
      where("matchId", "==", matchId),
      where("status", "in", ["paid", "completed"])
    );

    const unsubscribe = onSnapshot(
      paymentsQuery,
      snapshot => {
        const paidUserIds = new Set<string>();
        snapshot.forEach((docSnap: any) => {
          const data = docSnap.data() as any;
          if (data?.userId) {
            paidUserIds.add(data.userId);
          }
        });

        const both = paidUserIds.size >= 2;
        setBothUsersPaid(both);
        if (both) {
          setMessageLimitReached(false);
        }
      },
      error => {
        console.error("Error listening to payment status:", error);
      }
    );

    return () => unsubscribe();
  }, [isSingleChat, matchId]);

  // Fetch meet data and check timing
  useEffect(() => {
    const fetchMeetDataAndCheckTiming = async () => {
      if (isSingleChat && matchId && bothUsersPaid) {
        try {
          const db = getFirestore();
          const meetRef = doc(
            db,
            "messages",
            matchId as string,
            "meet",
            "confirm"
          );
          const meetSnap = await getDoc(meetRef);

          if (meetSnap.exists()) {
            const meetData = meetSnap.data();

            // Check if event time is within 24 hours using finalDate and finalTime
            if (meetData && meetData.finalDate && meetData.finalTime) {
              // Parse the date and time properly
              const [year, month, day] = meetData.finalDate
                .split("-")
                .map(Number);
              const timeStr = meetData.finalTime; // "11:00 AM"

              // Convert 12-hour format to 24-hour format
              let [time, period] = timeStr.split(" ");
              let [hours, minutes] = time.split(":").map(Number);

              if (period === "PM" && hours !== 12) {
                hours += 12;
              } else if (period === "AM" && hours === 12) {
                hours = 0;
              }

              // Create event datetime
              const eventDateTime = new Date(
                year,
                month - 1,
                day,
                hours,
                minutes
              );
              const now = new Date();
              const timeDiff = eventDateTime.getTime() - now.getTime();
              const hoursDiff = timeDiff / (1000 * 60 * 60);

              // Disable input if more than 24 hours until event
              setIsInputDisabled(hoursDiff > 24);

              // Check if event has passed
              setEventHasPassed(hoursDiff < 24);
            }
          }
        } catch (error) {
          console.error("Error fetching meet data:", error);
        }
      }
    };

    fetchMeetDataAndCheckTiming();

    // Set up periodic check every minute to update disabled state
    const interval = setInterval(fetchMeetDataAndCheckTiming, 60000);

    return () => clearInterval(interval);
  }, [matchId, isSingleChat, bothUsersPaid]);

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

    const getReceiverId = (matchId: string, currentUserId: string): string => {
      const ids = matchId.split("_");
      return ids[0] === currentUserId ? ids[1] : ids[0];
    };

    try {
      if (isSingleChat) {
        // Use the stored boolean instead of checking every time
        if (bothUsersPaid) {
          // Both users have paid, allow unlimited messaging
          const receiverId = getReceiverId(matchId as string, user?.uid);
          await sendDirectMessage(
            matchId as string,
            user?.uid,
            message,
            receiverId
          );
          setMessage("");
          return;
        }

        // If both users haven't paid, check message limit
        const messageCount = await checkAndUpdateMessageLimit(
          matchId as string,
          user?.uid
        );
        if (messageCount > 5) {
          setMessageLimitReached(true);
          return;
        }

        const receiverId = getReceiverId(matchId as string, user?.uid);

        await sendDirectMessage(
          matchId as string,
          user?.uid,
          message,
          receiverId
        );
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
      showToaster({
        message: error.message || "Failed to send message",
        type: "error",
      });
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
        showToaster({
          message: "User not found in group",
          type: "error",
        });
        return;
      }

      await updateDoc(groupRef, {
        users: arrayRemove(userInGroup),
      });

      showToaster({
        message: "You have left the group",
        type: "success",
      });
      router.back(); // Navigate back after leaving
    } catch (error) {
      console.error("Error leaving group:", error);
      showToaster({
        message: "Failed to leave group",
        type: "error",
      });
    }
  };

  // Initialize payment before opening modal
  const initializePayment = async () => {
    if (!user?.uid || !matchId) {
      showToaster({
        message: "Missing required data for payment",
        type: "error",
      });
      return;
    }

    try {
      // Navigate to the message payment screen
      router.push({
        pathname: "/messages/payment",
        params: { matchId: matchId as string },
      });
    } catch (error) {
      console.error("Error navigating to payment:", error);
      showToaster({
        message: "Failed to navigate to payment. Please try again.",
        type: "error",
      });
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

      showToaster({
        message: `${user.name} has been removed from the group`,
        type: "success",
      });
    } catch (error) {
      console.error("Error removing user:", error);
      showToaster({
        message: "Failed to remove user",
        type: "error",
      });
    }
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
          setMeetConfirm(true);
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

            {isSingleChat && !userHasPaid && !bothUsersPaid && (
              <PaymentTimer
                matchId={matchId as string}
                theme={theme}
                styles={paymentStyleSheet}
                currentUserId={user?.uid || ""}
              />
            )}

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
                      uri: group?.image || encodeImagePath(reciverData?.photo),
                    }}
                    style={styles.userAvatar}
                  />
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
              ) : bothUsersPaid && !meetConfirm ? (
                <TouchableOpacity
                  onPress={handleMeetPress} // navigate to meet setup screen
                >
                  <MaterialIcons
                    name="video-call"
                    size={20}
                    color={Colors[theme].greenText}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {isSingleChat && (
              <>
                {statusMessage?.type === "text" && (
                  <RnText style={uiStyleSheet.text}>
                    {statusMessage.message}
                  </RnText>
                )}

                {statusMessage?.type === "button" && (
                  <TouchableOpacity
                    onPress={handleDetailsPress}
                    style={uiStyleSheet.finalButton}
                  >
                    <RnText style={uiStyleSheet.finalText}>
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
            {messageLimitReached && !bothUsersPaid && !userHasPaid ? (
              <View style={uiStyleSheet.payNowContainer}>
                <RnText style={uiStyleSheet.payNowText}>
                  Message limit reached. Pay to continue chatting!
                </RnText>
                <RnButton
                  title="Pay Now"
                  onPress={initializePayment}
                  style={[uiStyleSheet.payNowButton]}
                />
              </View>
            ) : userHasPaid && !bothUsersPaid ? (
              <View style={uiStyleSheet.waitingContainer}>
                <RnText style={uiStyleSheet.waitingText}>
                  You&apos;ve paid! Waiting for the other user to pay.
                </RnText>
              </View>
            ) : isInputDisabled ? (
              <View style={uiStyleSheet.waitingContainer}>
                <RnText style={uiStyleSheet.waitingText}>
                  Messaging disabled until 24 hours before event
                </RnText>
              </View>
            ) : eventHasPassed ? (
              <View style={uiStyleSheet.waitingContainer}>
                <RnText style={uiStyleSheet.waitingText}>
                  Event has passed for more than 24 hours. Messaging is now
                  disabled.
                </RnText>
              </View>
            ) : (
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
                  editable={true}
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
            )}
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
            <View style={uiStyleSheet.modalBackground}>
              <View style={uiStyleSheet.meetModalContainer}>
                <RnText style={uiStyleSheet.modalTitle}>
                  Final Meet Details
                </RnText>

                <RnText style={uiStyleSheet.modalText}>
                  Location: {statusMessage?.finalData?.finalPlace}
                </RnText>
                <RnText style={uiStyleSheet.modalText}>
                  Date: {statusMessage?.finalData?.finalDate}
                </RnText>
                <RnText style={uiStyleSheet.modalText}>
                  Time: {statusMessage?.finalData?.finalTime}
                </RnText>

                <TouchableOpacity
                  onPress={() => setMeetDataModalVisible(false)}
                  style={uiStyleSheet.modalCloseButton}
                >
                  <RnText style={uiStyleSheet.modalCloseText}>Close</RnText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
