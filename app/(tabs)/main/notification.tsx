import createStyles from "@/app/tabStyles/notification.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  listenToUserNotifications,
  markNotificationAsRead,
} from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";
import { encodeImagePath } from "@/utils";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  read: boolean;
  dataId: string;
  type?: string;
  groupId?: string;
  status?: string;
};

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToUserNotifications(user.uid, setNotifications);

    return () => unsubscribe();
  }, [user]);

  const handleNotificationPress = async (item: NotificationItem) => {
    // Mark notification as read
    if (user?.uid && !item.read) {
      await markNotificationAsRead(user.uid, item.id);
    }

    if (item.type === "reel") {
      handleReelNotificationPress(item.dataId);
    }
    if (item.type === "like") {
      handleLikeNotificationPress(item.dataId);
    }
    if (item.type === "match") {
      handleMatchNotificationPress(item.dataId);
    }
    if (item.type === "message") {
      handleMessageNotificationPress(item.dataId);
    }
  };

  const handleGroupNotificationPress = (groupId: string) => {
    router.push(`/mainScreens/hangoutDetails?groupId=${groupId}`);
  };

  const handleReelNotificationPress = (userId: string) => {
    router.push({
      pathname: "/discover/[id]",
      params: { id: userId },
    });
  };

  const handleLikeNotificationPress = (userId: string) => {
    router.push({
      pathname: "/discover/[id]",
      params: { id: userId },
    });
  };

  const handleMatchNotificationPress = (userId: string) => {
    router.push({
      pathname: "/discover/[id]",
      params: { id: userId },
    });
  };

  const handleMessageNotificationPress = (messageId: string) => {
    router.push({
      pathname: "/messages/chat/[id]",
      params: { id: messageId },
    });
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <Image
        source={{ uri: encodeImagePath(item.image) }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <RnText style={[styles.title, item.read && styles.readTitle]}>
          {item.title}
        </RnText>
        <RnText
          style={[styles.description, item.read && styles.readDescription]}
        >
          {item.description}
        </RnText>

        {item.type === "groupMessage" && item.status === "pending" && (
          <RnButton
            style={[styles.buttonContainer, styles.buttonText]}
            title="View Details"
            onPress={() => handleGroupNotificationPress(item.id)}
          />
        )}

        {item.type === "groupMessage" && item.status === "accepted" && (
          <RnText style={styles.acceptedText}>✓ Accepted</RnText>
        )}

        {item.type === "groupMessage" && item.status === "rejected" && (
          <RnText style={styles.rejectedText}>✗ Declined</RnText>
        )}

        <RnText style={styles.time}>{item.time}</RnText>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerTitle}>Notifications</RnText>
        <RoundButton noShadow />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <RnText style={styles.emptyText}>No notifications</RnText>
          </View>
        }
      />
    </Container>
  );
}
