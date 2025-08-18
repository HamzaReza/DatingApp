import { store } from "@/redux/store";
import { User } from "@/types/Messages";
import { sendPushNotification } from "@/utils/sendPushNotification";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import { Alert } from "react-native";

// Types for message data
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: "text" | "image" | "audio";
  mediaUrl?: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  groupId: string;
  content: string;
  timestamp: Date;
  isRead: { [userId: string]: boolean };
  messageType: "text" | "image" | "audio";
  mediaUrl?: string;
}

export interface GroupUser {
  uid: string;
  name: string;
  status: "pending" | "accepted" | "rejected";
  invitedAt: Timestamp | Date;
}

export interface Group {
  messages: never[];
  id: string;
  groupName: string;
  image?: string;
  invitedBy: string;
  invitedByName: string;
  invitedAt: Timestamp | Date;
  maxParticipants: number;
  noOfInvitors: number;
  tags: string[];
  type: "group";
  users: GroupUser[];
  createdAt: Timestamp | Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: Date;
  unreadCount: number;
}

// Create a new message
const sendDirectMessage = async (
  matchId: string,
  senderId: string,
  content: string,
  receiverId: string
): Promise<void> => {
  try {
    if (!matchId || typeof matchId !== "string") {
      throw new Error("Invalid matchId");
    }

    const db = getFirestore();
    const messageRef = doc(db, "messages", matchId);

    const newMessage = {
      id: Timestamp.now().toMillis().toString(),
      senderId,
      content,
      timestamp: new Date(),
      read: false,
    };

    const lastMessageInfo = {
      content,
      senderId,
      timestamp: serverTimestamp(), // For sorting
    };

    const docSnapshot = await getDoc(messageRef);

    if (docSnapshot.exists()) {
      await updateDoc(messageRef, {
        messages: arrayUnion(newMessage),
        lastUpdated: serverTimestamp(),
        lastMessage: lastMessageInfo, // ✅ Store last message preview
      });
    } else {
      await setDoc(messageRef, {
        messages: [newMessage],
        lastUpdated: serverTimestamp(),
        lastMessage: lastMessageInfo, // ✅ Store last message preview
        participants: matchId.includes("_")
          ? matchId.split("_")
          : [senderId, matchId],
      });
    }

    // if (receiverId) {
    //   await sendInAppNotification({
    //     toUserId: receiverId,
    //     title: "You got a new message!",
    //     subtitle: content,
    //     type: "message",
    //     data: {
    //       matchId,
    //       senderId,
    //       image: store.getState().user.user?.photo,
    //     },
    //   });
    // }
    await sendPushNotification({
      toUserId: [receiverId],
      title: "You got a new message!",
      subtitle: `${store.getState().user.user?.name} sent you a message`,
      data: {
        matchId,
        senderId,
        image: store.getState().user.user?.photo,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

export const checkAndUpdateMessageLimit = async (
  chatId: string,
  senderId: string
): Promise<number> => {
  const db = getFirestore();
  const limitRef = doc(db, "messageLimits", chatId);
  const snapshot = await getDoc(limitRef);

  let data: any = {};
  let currentCount = 0;

  if (snapshot.exists()) {
    data = snapshot.data();
    currentCount = data[senderId] || 0;
  }

  // update sender's message count

  await setDoc(
    limitRef,
    {
      [senderId]: currentCount + 1,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );

  return currentCount + 1;
};

export const checkMessageLimit = async (
  chatId: string,
  senderId: string
): Promise<number> => {
  const db = getFirestore();
  const limitRef = doc(db, "messageLimits", chatId);
  const snapshot = await getDoc(limitRef);

  let currentCount = 0;

  if (snapshot.exists()) {
    const data = snapshot.data();
    currentCount = data?.[senderId] || 0;
  }

  return currentCount;
};

// Fetch messages between two users
const fetchMessagesBetweenUsers = (
  user1Id: string,
  user2Id: string,
  callback: (messages: Message[]) => void
) => {
  try {
    const db = getFirestore();
    const messagesRef = collection(db, "messages");

    // Query for messages where user1 is sender and user2 is receiver
    const q1 = query(
      messagesRef,
      where("senderId", "==", user1Id),
      where("receiverId", "==", user2Id),
      orderBy("timestamp", "asc")
    );

    // Query for messages where user2 is sender and user1 is receiver
    const q2 = query(
      messagesRef,
      where("senderId", "==", user2Id),
      where("receiverId", "==", user1Id),
      orderBy("timestamp", "asc")
    );

    const unsubscribe1 = onSnapshot(
      q1,
      snapshot1 => {
        const unsubscribe2 = onSnapshot(
          q2,
          snapshot2 => {
            const messages1 = snapshot1.docs.map(
              (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
              })
            ) as Message[];

            const messages2 = snapshot2.docs.map(
              (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
              })
            ) as Message[];

            // Combine and sort all messages by timestamp
            const allMessages = [...messages1, ...messages2].sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );

            callback(allMessages);
          },
          error => {
            console.error("Error in messages listener (q2):", error);
            callback([]);
          }
        );

        return () => {
          unsubscribe2();
        };
      },
      error => {
        console.error("Error in messages listener (q1):", error);
        callback([]);
      }
    );

    return unsubscribe1;
  } catch (error) {
    console.error("Error setting up messages listener:", error);
    throw error;
  }
};

// Fetch all conversations for a user
const fetchUserConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
) => {
  try {
    const db = getFirestore();
    const messagesRef = collection(db, "messages");

    // Get messages where user is sender
    const sentMessagesQuery = query(
      messagesRef,
      where("senderId", "==", userId),
      orderBy("timestamp", "desc")
    );

    // Get messages where user is receiver
    const receivedMessagesQuery = query(
      messagesRef,
      where("receiverId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const unsubscribeSent = onSnapshot(
      sentMessagesQuery,
      sentSnapshot => {
        const unsubscribeReceived = onSnapshot(
          receivedMessagesQuery,
          receivedSnapshot => {
            const sentMessages = sentSnapshot.docs.map(
              (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
              })
            ) as Message[];

            const receivedMessages = receivedSnapshot.docs.map(
              (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
              })
            ) as Message[];

            // Group messages by conversation
            const conversationMap = new Map<string, Message[]>();

            // Add sent messages
            sentMessages.forEach(message => {
              const conversationId = message.receiverId;
              if (!conversationMap.has(conversationId)) {
                conversationMap.set(conversationId, []);
              }
              conversationMap.get(conversationId)!.push(message);
            });

            // Add received messages
            receivedMessages.forEach(message => {
              const conversationId = message.senderId;
              if (!conversationMap.has(conversationId)) {
                conversationMap.set(conversationId, []);
              }
              conversationMap.get(conversationId)!.push(message);
            });

            // Create conversation objects
            const conversations: Conversation[] = Array.from(
              conversationMap.entries()
            ).map(([participantId, messages]) => {
              // Sort messages by timestamp
              const sortedMessages = messages.sort(
                (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
              );

              const lastMessage = sortedMessages[sortedMessages.length - 1];
              const unreadCount = messages.filter(
                msg => msg.receiverId === userId && !msg.isRead
              ).length;

              return {
                id: participantId,
                participants: [userId, participantId],
                lastMessage,
                lastMessageTime: lastMessage?.timestamp,
                unreadCount,
              };
            });

            // Sort conversations by last message time
            conversations.sort((a, b) => {
              if (!a.lastMessageTime && !b.lastMessageTime) return 0;
              if (!a.lastMessageTime) return 1;
              if (!b.lastMessageTime) return -1;
              return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
            });

            callback(conversations);
          },
          error => {
            console.error("Error in received messages listener:", error);
            callback([]);
          }
        );

        return () => {
          unsubscribeReceived();
        };
      },
      error => {
        console.error("Error in sent messages listener:", error);
        callback([]);
      }
    );

    return unsubscribeSent;
  } catch (error) {
    console.error("Error setting up conversations listener:", error);
    throw error;
  }
};

// Mark messages as read
const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    const db = getFirestore();
    const updatePromises = messageIds.map(messageId => {
      const messageRef = doc(db, "messages", messageId);
      return updateDoc(messageRef, { isRead: true });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

// Mark conversation as read
const markConversationAsRead = async (userId: string, otherUserId: string) => {
  try {
    const db = getFirestore();
    const messagesRef = collection(db, "messages");

    // Get unread messages where user is receiver and other user is sender
    const q = query(
      messagesRef,
      where("senderId", "==", otherUserId),
      where("receiverId", "==", userId),
      where("isRead", "==", false)
    );

    const snapshot = await getDocs(q);
    const messageIds = snapshot.docs.map((doc: any) => doc.id);

    if (messageIds.length > 0) {
      await markMessagesAsRead(messageIds);
    }
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    throw error;
  }
};

// Delete a message
const deleteMessage = async (messageId: string) => {
  try {
    const db = getFirestore();
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Functions for hangout and message management
export const fetchUserGroups = async (userId: string) => {
  const db = getFirestore();
  const groupsRef = collection(db, "messages");
  const q = query(groupsRef, where("type", "==", "group"));
  const snapshot = await getDocs(q);

  const userGroups = snapshot.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() }))
    .filter((group: any) => {
      const matchedUser = group.users?.find((u: any) => u.uid === userId);
      return matchedUser && matchedUser.status === "accepted";
    });

  return userGroups;
};

export const sendGroupMessage = async (messageData: {
  senderId: string;
  groupId: string;
  content: string;
  messageType?: "text" | "image" | "audio";
  mediaUrl?: string;
}): Promise<void> => {
  try {
    const db = getFirestore();
    const groupRef = doc(db, "messages", messageData.groupId);

    const newMessage: any = {
      id: Timestamp.now().toMillis().toString(),
      senderId: messageData.senderId,
      content: messageData.content,
      timestamp: new Date(),
      isRead: false,
      messageType: messageData.messageType || "text",
      ...(messageData.mediaUrl && { mediaUrl: messageData.mediaUrl }),
    };

    await updateDoc(groupRef, {
      messages: arrayUnion(newMessage),
      lastMessage: newMessage,
      lastMessageTime: serverTimestamp(), // ✅ use serverTimestamp
    });
  } catch (error) {
    console.error("Error sending group message:", error);
    throw error;
  }
};

export const setupGroupMessagesListener = (
  groupId: string,
  callback: (group: Group) => void
): (() => void) => {
  const db = getFirestore();
  const groupRef = doc(db, "messages", groupId);

  return onSnapshot(groupRef, async doc => {
    if (doc.exists()) {
      const groupData = doc.data() as Group;

      // Enhance messages with user data
      const enhancedMessages: any = await Promise.all(
        (groupData.messages || []).map(async (msg: any) => {
          const user = await getUser(msg.senderId);
          return {
            ...msg,
            timestamp: msg.timestamp?.toDate() || new Date(),
            senderName: user?.name || "Unknown",
            senderImage: user?.photo || null,
          };
        })
      );

      callback({
        ...groupData,
        id: doc.id,
        messages: enhancedMessages,
      });
    }
  });
};

export const setupDirectMessageListener = (
  matchId: string,
  callback: (messages: Message[]) => void
) => {
  const db = getFirestore();
  const messageRef = doc(db, "messages", matchId);

  return onSnapshot(messageRef, (doc: any) => {
    if (doc.exists()) {
      callback(doc.data().messages || []);
    }
  });
};

const userCache = new Map<string, User>();

export const getUser = async (userId: string): Promise<User | null> => {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  try {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      userCache.set(userId, userData);
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const fetchOneToOneChats = async (userId: string) => {
  const db = getFirestore();
  const messagesRef = collection(db, "messages");
  const snapshot = await getDocs(messagesRef);

  const oneToOneChats = snapshot.docs
    .filter((doc: any) => {
      const idParts = doc.id.split("_");
      return (
        idParts.length === 2 && (idParts[0] === userId || idParts[1] === userId)
      );
    })
    .map((doc: any) => ({ id: doc.id, ...doc.data() }));

  return oneToOneChats;
};

const fetchMeetData = async (groupId: string) => {
  try {
    const db = getFirestore();
    const meetRef = doc(db, "meets", groupId);
    const meetSnap = await getDoc(meetRef);

    if (meetSnap.exists()) {
      return meetSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching meet data:", error);
    return null;
  }
};

// matches

export const checkIfMeetRejected = async (matchId: any, currentUserId: any) => {
  const db = getFirestore();
  const rejectedSnap = await getDoc(
    doc(db, "messages", matchId, "meet", "rejected")
  );

  if (rejectedSnap.exists()) {
    const rejection: any = rejectedSnap.data();

    // Only show alert if rejected by other user
    if (rejection.userId !== currentUserId) {
      const unavailable = rejection.unavailable || [];
      const reasons = rejection.reasons || {};

      // Format reasons for display
      const reasonText = Object.entries(reasons)
        .map(([item, reason]) => `${item}: ${reason}`)
        .join("\n");

      Alert.alert(
        "Meet Preferences Rejected",
        `Unavailable items:\n${unavailable.join(
          ", "
        )}\n\nReasons:\n${reasonText}`
      );
    }

    return rejection;
  }

  return null;
};

export const listenToUserGroups = (
  userId: string,
  callback: (groups: any[]) => void
) => {
  const db = getFirestore();
  const groupsRef = collection(db, "messages");
  const q = query(groupsRef, where("type", "==", "group"));

  const unsubscribe = onSnapshot(q, snapshot => {
    const userGroups = snapshot.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .filter((group: any) => {
        const matchedUser = group.users?.find((u: any) => u.uid === userId);
        return matchedUser && matchedUser.status === "accepted";
      });

    callback(userGroups);
  });

  return unsubscribe;
};

export const listenToOneToOneChats = (
  userId: string,
  callback: (chats: any[]) => void
) => {
  const db = getFirestore();
  const messagesRef = collection(db, "messages");

  const unsubscribe = onSnapshot(messagesRef, snapshot => {
    const oneToOneChats = snapshot.docs
      .filter((doc: any) => {
        const idParts = doc.id.split("_");
        return (
          idParts.length === 2 &&
          (idParts[0] === userId || idParts[1] === userId)
        );
      })
      .map((doc: any) => ({ id: doc.id, ...doc.data() }));

    callback(oneToOneChats);
  });

  return unsubscribe;
};

export const setupChatListeners = (
  onGroupsUpdate: (groups: any[]) => void,
  onOneToOneUpdate: (chats: any[]) => void
) => {
  const currentUserId = store.getState().user.user.uid;

  if (!currentUserId) {
    throw new Error("No authenticated user found");
  }

  const unsubscribeGroups = listenToUserGroups(currentUserId, onGroupsUpdate);
  const unsubscribeOneToOne = listenToOneToOneChats(
    currentUserId,
    onOneToOneUpdate
  );

  return {
    unsubscribe: () => {
      unsubscribeGroups();
      unsubscribeOneToOne();
    },
    unsubscribeGroups,
    unsubscribeOneToOne,
  };
};
export {
  deleteMessage,
  fetchMeetData,
  fetchMessagesBetweenUsers,
  fetchUserConversations,
  markConversationAsRead,
  markMessagesAsRead,
  sendDirectMessage,
};
