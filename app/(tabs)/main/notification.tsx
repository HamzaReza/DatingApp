import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import createStyles from "../../tabStyles/notification.styles";

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

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, item.read && styles.cardRead]}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.content}>
        <RnText style={styles.title}>{item.title}</RnText>
        <RnText style={styles.description}>{item.description}</RnText>
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
          iconSize={24}
          iconColor={Colors[theme].greenText}
          borderColor={Colors[theme].background}
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
