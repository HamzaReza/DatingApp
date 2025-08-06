import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import createStyles from "@/app/mainScreens/styles/hangoutDetails.styles";
import PrimaryHeader from "@/components/PrimaryHeader";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { markNotificationAsRead, respondToGroupInvite } from "@/firebase/auth";
import { RootState } from "@/redux/store";
import { wp } from "@/utils";
import { router } from "expo-router";
import { useSelector } from "react-redux";

interface User {
  uid: string;
  name: string;
  status: "pending" | "accepted" | "rejected";
  avatar?: string;
}

interface GroupData {
  id: string;
  groupName: string;
  groupDescription: string;
  eventDate: any;
  tags: string[];
  slectedGender: string;
  minAge: number;
  maxAge: number;
  invitedByName: string;
  users: User[];
  image?: string;
  createdAt: Date;
  lastMessageTime?: Date;
}

const GroupDetailsScreen = () => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { groupId } = route.params;
  const { user } = useSelector((state: RootState) => state.user);

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUserStatus, setCurrentUserStatus] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const db = getFirestore();
        const groupDoc = await getDoc(doc(db, "messages", groupId));

        if (!groupDoc.exists()) {
          Alert.alert("Error", "Group not found");
          navigation.goBack();
          return;
        }

        const groupData = groupDoc.data() as GroupData;
        setGroup(groupData);

        // Find current user's status
        const tempUser = groupData.users.find(u => u.uid === user?.uid);
        if (tempUser) {
          setCurrentUserStatus(tempUser.status);
        }
      } catch (error) {
        console.error("Error fetching group:", error);
        Alert.alert("Error", "Failed to load group details");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleResponse = async (accept: boolean) => {
    if (!user?.uid || !groupId) return;

    setActionLoading(true);
    try {
      await respondToGroupInvite(groupId, user?.uid, accept);

      // Mark the notification as read
      await markNotificationAsRead(user.uid, groupId);

      setCurrentUserStatus(accept ? "accepted" : "rejected");

      Alert.alert(
        accept ? "Invite Accepted" : "Invite Declined",
        accept ? "You can now chat with the group" : "Invite declined"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to process response");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Date not set";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return Colors.light.primary;
      case "rejected":
        return Colors.light.redText;
      default:
        return Colors.light.tabIconDefault;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!group) return null;

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: wp(2) }}>
        <PrimaryHeader
          title="Group Invitation"
          showRightIcon={false}
          onLeftPress={() => router.back()}
        />
      </View>

      <ScrollContainer>
        {/* Group Image */}
        {group.image && (
          <Image source={{ uri: group.image }} style={styles.groupImage} />
        )}

        {/* Group Info */}
        <View style={styles.infoCard}>
          <RnText style={styles.groupName}>{group.groupName}</RnText>
          <RnText style={styles.groupDescription}>
            {group.groupDescription}
          </RnText>
          <RnText style={styles.invitedByText}>
            Invited by {group.invitedByName}
          </RnText>
        </View>

        {/* Event Details */}
        <View style={styles.detailsCard}>
          <RnText style={styles.sectionTitle}>Event Details</RnText>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            <RnText style={styles.detailValue}>
              {formatDate(group.eventDate)}
            </RnText>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="pricetags" size={20} color={Colors.light.primary} />
            <View style={styles.tagsContainer}>
              {group.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <RnText style={styles.tagText}>{tag}</RnText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people" size={20} color={Colors.light.primary} />
            <RnText style={styles.detailValue}>
              {group.genderFilter || "Any gender"} • Ages {group.minAge}-
              {group.maxAge}
            </RnText>
          </View>
        </View>

        {/* Members List */}
        <View style={styles.usersCard}>
          <RnText style={styles.sectionTitle}>
            Invited Members ({group.users.length})
          </RnText>

          {group.users.map(user => (
            <View key={user.uid} style={styles.userRow}>
              <View style={styles.userInfo}>
                {user.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={24}
                    color={Colors.light.tabIconDefault}
                  />
                )}
                <RnText style={styles.userName}>{user.name}</RnText>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(user.status)}20` },
                ]}
              >
                <RnText
                  style={[
                    styles.statusText,
                    { color: getStatusColor(user.status) },
                  ]}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </RnText>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons or Status Message */}
        {currentUserStatus === "pending" ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleResponse(false)}
              disabled={actionLoading}
            >
              <RnText style={styles.actionButtonText}>Decline</RnText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleResponse(true)}
              disabled={actionLoading}
            >
              <RnText style={styles.actionButtonText}>Accept</RnText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusMessage}>
            <RnText
              style={[
                styles.statusText,
                { color: getStatusColor(currentUserStatus) },
              ]}
            >
              You've already {currentUserStatus} this invitation
            </RnText>
          </View>
        )}
      </ScrollContainer>
    </View>
  );
};

export default GroupDetailsScreen;
