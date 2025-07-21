import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, TouchableOpacity, View } from "react-native";
import createStyles from "../../tabStyles/notification.styles";
import { getAuth } from "@react-native-firebase/auth";
import { getUserNotifications, respondToGroupInvite } from "@/firebase/auth";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  read: boolean;
};

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Match!",
    description: "You have a new match with Clara.",
    time: "2m ago",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=100",
    read: false,
  },
  {
    id: "2",
    title: "Event Reminder",
    description: "Designers Meetup 2022 starts in 1 hour.",
    time: "1h ago",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    read: false,
  },
  {
    id: "3",
    title: "Message Received",
    description: "Selena sent you a new message.",
    time: "3h ago",
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100",
    read: true,
  },
  {
    id: "4",
    title: "Event Update",
    description: "Basketball Final Match location changed.",
    time: "Yesterday",
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100",
    read: true,
  },
];

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const currentUser = getAuth().currentUser;


  useEffect(()=>{
console.log('hi',notifications)
  },[notifications])

 useEffect(() => {
  const fetchNotifications = async () => {
    if (currentUser) {
      try {
        const notifs = await getUserNotifications(currentUser.uid);
        console.log('Raw notifications from Firestore:', notifs);
        
        const formattedNotifications = notifs.map(notif => {
          // Ensure we have proper fallbacks for all required fields
          const defaultImage = "https://example.com/default-user.png"; // Add your default image
          
          return {
            id: notif.groupId || `notif-${Date.now()}`,
            title: notif.title || "New Notification",
            description: notif.subtitle || notif.message || "You have a new notification",
            time: formatTime(notif.createdAt?.toDate?.() || new Date()),
            image: notif.inviterImage || notif.senderImage || defaultImage,
            read: notif.read || false,
            type: notif.type === "messages" ? "group_invite" : notif.type, // Normalize type
            groupId: notif.groupId,
            status: notif.status || "pending" // Default status
          };
        });

        console.log('Formatted notifications:', formattedNotifications);
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };
  
  fetchNotifications();
}, [currentUser]);

   const formatTime = (date?: Date) => {
    if (!date) return "Just now";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)}h ago`;
    return `${Math.floor(minutes/1440)}d ago`;
  };

   const handleResponse = async (groupId: string, accept: boolean) => {
  try {
    if (!currentUser) return;
    
    await respondToGroupInvite(groupId, currentUser.uid, accept);
    
    // Update local state
    setNotifications(prev => prev.map(notif => 
      notif.groupId === groupId 
        ? { ...notif, status: accept ? "accepted" : "rejected" }
        : notif
    ));
    
    Alert.alert(
      accept ? "Invite Accepted" : "Invite Declined",
      accept 
        ? "You can now chat with the group" 
        : "The invite has been declined"
    );
  } catch (error) {
    Alert.alert("Error", "Failed to process your response");
  }
};

    const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, item.read && styles.cardRead]}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.avatar} 
      />
      <View style={styles.content}>
        <RnText style={styles.title}>{item.title}</RnText>
        <RnText style={styles.description}>{item.description}</RnText>
        
        {item.type === "group_invite" && item.status === "pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleResponse(item.groupId!, true)}
            >
              <RnText style={styles.buttonText}>Accept</RnText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleResponse(item.groupId!, false)}
            >
              <RnText style={styles.buttonText}>Reject</RnText>
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
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
