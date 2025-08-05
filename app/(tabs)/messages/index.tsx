import createStyles from "@/app/tabStyles/messages.styles";
import { MessageItem } from "@/components/MessageItem";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnDateTimePicker from "@/components/RnDateTimePicker";
import RnDropdown from "@/components/RnDropdown";
import RnImagePicker from "@/components/RnImagePicker";
import RnInput from "@/components/RnInput";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  fetchTags,
  getUserByUid,
  sendGroupInvitesByTags,
  uploadImage,
} from "@/firebase/auth";
import {
  fetchOneToOneChats,
  fetchUserGroups,
  setupChatListeners,
} from "@/firebase/message";
import { encodeImagePath, wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import {
  Accuracy,
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
} from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type RecentMatch = {
  id: string;
  name: string;
  image: string;
  likes?: number;
};

type Message = {
  id: string;
  groupName?: string;
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

interface Tag {
  label: string;
  value: string;
}

interface DropdownItem {
  label: string;
  value: number;
}

export default function Messages() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);

  const [tagsOpen, setTagsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [tagsItems, setTagsItems] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [countOpen, setCountOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(5);
  const [countItems, setCountItems] = useState<DropdownItem[]>([
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
  ]);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-Binary", value: "non-binary" },
    { label: "Mixed", value: "mixed" },
  ]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [groupDescription, setGroupDescription] = useState("");
  const [oneToOneList, setOneToOneList] = useState([]);
  const [chatList, setChatList] = useState<Message[]>([]);
  const [receiverId, setRecieverId] = useState("");
  const [chatStatusMap, setChatStatusMap] = useState<any>({});

  const currentUserId = getAuth().currentUser?.uid;
  const memoizedGroupList = useMemo(() => groupList, [groupList]);
  const memoizedOneToOneList = useMemo(() => oneToOneList, [oneToOneList]);
  const memoizedChatStatusMap = useMemo(() => chatStatusMap, [chatStatusMap]);

  useEffect(() => {
    const currentUserId = getAuth().currentUser?.uid as string;
    console.log("currentUserId", currentUserId);

    const { unsubscribe } = setupChatListeners(
      groups => setGroupList(groups),
      (chats: any) => setOneToOneList(chats)
    );

    return () => unsubscribe();
  }, []);

  const listenToMeetStatus = (convoId: any, updateChatStatus: any) => {
    const db = getFirestore();

    const confirmRef = doc(db, "messages", convoId, "meet", "confirm");
    const rejectRef = doc(db, "messages", convoId, "meet", "rejected");

    const unsubConfirm = onSnapshot(confirmRef, docSnap => {
      updateChatStatus(convoId, (prev: any) => ({
        ...prev,
        isConfirmed: docSnap.exists(),
      }));
    });

    const unsubReject = onSnapshot(rejectRef, docSnap => {
      updateChatStatus(convoId, (prev: any) => ({
        ...prev,
        isRejected: docSnap.exists(),
      }));
    });

    return [unsubConfirm, unsubReject];
  };

  const updateChatStatus = (convoId: any, statusUpdateFn: any) => {
    setChatStatusMap(prev => ({
      ...prev,
      [convoId]: statusUpdateFn(prev[convoId] || {}),
    }));
  };

  useEffect(() => {
    const unsubListeners: any = [];

    const prepareChatList = async () => {
      const allChats: any = [];

      for (const group of groupList) {
        const timestamp =
          group.lastMessage?.timestamp || group.lastUpdated || new Date();

        allChats.push({
          id: group.id,
          groupName: group.groupName,
          message: group.lastMessage,
          time: formatTimestamp(timestamp),
          rawTime: timestamp,
          image: group.image,
          isOnline: group.isOnline,
          unread: group.unread,
          type: "group",
          lastMessage: group.lastMessage?.content || "",
        });
      }

      for (const convo of oneToOneList as any) {
        const otherUserId = convo.participants.find(
          (p: any) => p !== currentUserId
        );
        setRecieverId(otherUserId);
        if (!otherUserId) continue;

        const unsubscribe = getUserByUid(otherUserId, user => {
          if (!user) return;

          const lastMessage = convo.messages?.[convo.messages.length - 1];
          const timestamp =
            lastMessage?.timestamp || convo.lastUpdated || new Date();

          const convoId = convo.id;

          const status = chatStatusMap[convoId] || {
            isConfirmed: false,
            isRejected: false,
          };

          const chatData = {
            id: convoId,
            groupName: user.name,
            message: lastMessage?.text || "No message yet",
            time: formatTimestamp(timestamp),
            rawTime: timestamp,
            image: encodeImagePath(user.photo) || null,
            isOnline: user.isOnline || false,
            unread: convo.unread || 0,
            lastMessage: lastMessage?.content || "No message yet",
            type: "single",
            ...status,
          };

          allChats.push(chatData);

          unsubListeners.push(...listenToMeetStatus(convoId, updateChatStatus));
        });

        unsubListeners.push(unsubscribe);
      }

      allChats.sort((a: any, b: any) => {
        const getTime = (t: any) =>
          t?.seconds
            ? t.seconds * 1000
            : t?.toDate
            ? t.toDate().getTime()
            : new Date(t).getTime();

        return getTime(b.rawTime) - getTime(a.rawTime);
      });

      setChatList(allChats);
    };

    prepareChatList();

    return () => {
      unsubListeners.forEach((unsub: any) => unsub());
    };
  }, [
    JSON.stringify(groupList),
    JSON.stringify(oneToOneList),
    JSON.stringify(chatStatusMap),
  ]);

  useEffect(() => {
    const unsubscribe = fetchTags(tags => {
      setTagsItems(
        tags.map((tag: Tag) => ({ label: tag.label, value: tag.label }))
      );
      setIsLoadingTags(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleCreateGroup = async () => {
    setIsBottomSheetVisible(true);
  };

  const handleRecentMatchPress = (matchId: string) => {
    if (matchId === "1") {
      console.log("Open likes");
    } else {
      router.push(`/messages/chat/${matchId}`);
    }
  };

  const handleMessagePress = (messageId: string, type: string) => {
    if (type == "group") {
      router.push(`/messages/chat/${messageId}`);
    } else {
      router.push({
        pathname: "/(tabs)/messages/chat/[id]",
        params: {
          matchId: messageId,
          otherUserId: receiverId,
          chatType: "single",
        },
      });
    }
  };

  const handleCreateHangout = async () => {
    if (
      !groupName ||
      !groupDescription ||
      !selectedTags ||
      !selectedGender ||
      !participantCount ||
      !maxAge ||
      !minAge ||
      !pickedImageUri ||
      !eventDate
    ) {
      Toast.show({
        type: "error",
        text1: "Complete all required fields",
        visibilityTime: 2000,
      });

      return;
    }

    try {
      const currentUserId = getAuth().currentUser?.uid as string;
      await sendGroupInvitesByTags(
        currentUserId,
        selectedTags,
        participantCount,
        pickedImageUri as string,
        groupName,
        groupDescription,
        selectedGender,
        minAge,
        maxAge,
        eventDate
      );
      setIsBottomSheetVisible(false);
      alert("Invites sent successfully");
    } catch (error: any) {
      alert(error.message || "Failed to send invites");
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const renderMessage = ({ item }: { item: any }) => {
    return (
      <MessageItem
        name={item.groupName ?? item.name}
        message={item.lastMessage}
        time={item.time}
        image={item.image}
        isOnline={item.isOnline}
        unread={item.unread}
        onPress={() => handleMessagePress(item.id, item.type)}
        isRejected={item.isRejected}
        isConfirmed={item.isConfirmed}
      />
    );
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

      <View style={styles.messagesContainer}>
        <FlatList
          data={chatList}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        />
      </View>
      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        snapPoints={["90%"]}
      >
        <View style={styles.bottomSheetContent}>
          <RnText style={styles.bottomSheetTitle}>Create a hangout</RnText>

          <View style={styles.inputWrapper}>
            <RnText style={styles.inputLabel}>Group Name:</RnText>
            <RnInput
              placeholder="Enter group name"
              maxLength={30}
              value={groupName}
              onChangeText={setGroupName}
              style={styles.inputStyle}
            />
          </View>

          <View style={styles.inputWrapper}>
            <RnText style={styles.inputLabel}>Group Description:</RnText>
            <RnInput
              placeholder="Enter group name"
              maxLength={30}
              value={groupDescription}
              onChangeText={setGroupDescription}
              style={styles.inputStyle}
            />
          </View>
          <View style={[styles.dropdownWrapper, { width: wp(84) }]}>
            <RnText style={styles.dropdownLabel}>Select Tags:</RnText>
            <RnDropdown
              open={tagsOpen}
              setOpen={setTagsOpen}
              value={selectedTags}
              setValue={setSelectedTags}
              items={tagsItems}
              setItems={setTagsItems}
              placeholder="Select tags..."
              multiple={true}
              min={1}
              zIndex={2000}
              zIndexInverse={1000}
              loading={isLoadingTags}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.dropdownWrapper}>
              <RnText style={styles.dropdownLabel}>Group Gender:</RnText>
              <RnDropdown
                open={genderOpen}
                setOpen={setGenderOpen}
                value={selectedGender}
                setValue={setSelectedGender}
                items={genderItems}
                setItems={setGenderItems}
                placeholder="Select gender..."
                zIndex={900}
                zIndexInverse={800}
              />
            </View>

            <View style={styles.dropdownWrapper}>
              <RnText style={styles.dropdownLabel}>Max Participants:</RnText>
              <RnDropdown
                open={countOpen}
                setOpen={setCountOpen}
                value={participantCount}
                setValue={setParticipantCount}
                items={countItems}
                setItems={setCountItems}
                placeholder="Select count..."
                zIndex={1000}
                zIndexInverse={2000}
              />
            </View>
          </View>

          <View style={""}></View>

          <View style={styles.inputWrapper}>
            <RnText style={styles.inputLabel}>Age Group:</RnText>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: wp(40) }}>
                <RnInput
                  placeholder="Min"
                  keyboardType="numeric"
                  value={minAge}
                  onChangeText={setMinAge}
                  style={{ width: wp(40) }}
                />
              </View>
              <View />
              <View style={{ width: wp(40) }}>
                <RnInput
                  placeholder="Max"
                  keyboardType="numeric"
                  value={maxAge}
                  onChangeText={setMaxAge}
                  style={{ width: wp(40) }}
                />
              </View>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View>
              <RnText style={styles.inputLabel}>Group Image:</RnText>
              <RnImagePicker
                visible={showImagePicker}
                showPicker={() => setShowImagePicker(true)}
                hidePicker={() => setShowImagePicker(false)}
                setUri={(uri: any) => {
                  setPickedImageUri(uri.uri);
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowImagePicker(true)}
                  style={styles.addImageButton}
                >
                  <RnText>Select Image</RnText>
                </TouchableOpacity>
              </RnImagePicker>
            </View>
            <View style={{ marginTop: wp(3) }}>
              <RnDateTimePicker
                value={eventDate}
                onChange={(_, date) => setEventDate(date)}
                label="Event Date"
                placeholder="event date"
                mode="date"
              />
            </View>
          </View>

          <RnButton
            style={[styles.createButton, styles.createButtonText]}
            onPress={handleCreateHangout}
            title="Create Hangout"
          />
        </View>
      </RnBottomSheet>
    </Container>
  );
}
