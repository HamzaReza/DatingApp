import createStyles from "@/app/tabStyles/notification.styles";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { getUserNotifications, respondToGroupInvite } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  read: boolean;
};

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.uid) {
        try {
          const notifs = await getUserNotifications(user.uid);

          const formattedNotifications = notifs.map(notif => {
            const defaultImage = "https://example.com/default-user.png";

            return {
              id: notif.groupId || `notif-${Date.now()}`,
              title: notif.title || "New Notification",
              description:
                notif.subtitle ||
                notif.message ||
                "You have a new notification",
              time: formatTime(notif.createdAt?.toDate?.() || new Date()),
              image: notif.inviterImage || notif.senderImage || defaultImage,
              read: notif.read || false,
              type: notif.type === "messages" ? "group_invite" : notif.type, // Normalize type
              groupId: notif.groupId,
              status: notif.status || "pending", // Default status
            };
          });

          setNotifications(formattedNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  const formatTime = (date?: Date) => {
    if (!date) return "Just now";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const handleResponse = async (groupId: string, accept: boolean) => {
    try {
      if (!user?.uid) return;

      await respondToGroupInvite(groupId, user.uid, accept);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.groupId === groupId
            ? { ...notif, status: accept ? "accepted" : "rejected" }
            : notif
        )
      );

      Alert.alert(
        accept ? "Invite Accepted" : "Invite Declined",
        accept
          ? "You can now chat with the group"
          : "The invite has been declined"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to process your response");
    }
  };

  const handleNotificationPress = (groupId: string) => {
    router.push(`/mainScreens/hangoutDetails?groupId=${groupId}`);
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, item.read && styles.cardRead]}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.content}>
        <RnText style={styles.title}>{item.title}</RnText>
        <RnText style={styles.description}>{item.description}</RnText>

        {item.type === "group_invite" && item.status === "pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleNotificationPress(item.id)}
            >
              <RnText style={styles.buttonText}>View Details</RnText>
            </TouchableOpacity>
          </View>
        )}

        {item.type === "group_invite" && item.status === "accepted" && (
          <RnText style={styles.acceptedText}>✓ Accepted</RnText>
        )}

        {item.type === "group_invite" && item.status === "rejected" && (
          <RnText style={styles.rejectedText}>✗ Declined</RnText>
        )}

        <RnText style={styles.time}>{item.time}</RnText>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <Container customStyle={{ marginBottom: 100 }}>
      <View style={styles.header}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerTitle}>Notifications</RnText>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
