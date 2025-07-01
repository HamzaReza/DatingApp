import createStyles from "@/app/adminStyles/user.id.styles";
import RnContainer from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { adminUsers } from "@/constants/adminUsers";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserStatus } from "@/types/Admin";
import { wp } from "@/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function UserProfile() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = adminUsers.find((u) => u.id === id);

  const [userStatus, setUserStatus] = useState<UserStatus>(
    user?.status || "pending"
  );
  const [selectedOption, setSelectedOption] = useState<UserStatus | null>(null);

  if (!user) {
    return (
      <RnContainer>
        <RnText style={styles.userName}>User not found</RnText>
      </RnContainer>
    );
  }

  const handleStatusChange = (status: UserStatus) => {
    setSelectedOption(status);
    setUserStatus(status);
  };

  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>User Profile</RnText>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      </View>
      <View
        style={[
          styles.statusTag,
          userStatus === "approved" && styles.statusTagApproved,
          userStatus === "rejected" && styles.statusTagRejected,
          userStatus === "pending" && styles.statusTagPending,
        ]}
      >
        <RnText style={styles.statusTagText}>
          {userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
        </RnText>
      </View>
      <RnText style={styles.userName}>{user.name}</RnText>
      <RnText style={styles.userBio} numberOfLines={2}>
        {user.bio}
      </RnText>
      <View style={styles.infoRow}>
        <RnText style={styles.infoLabel}>Age: </RnText>
        <RnText style={styles.infoValue}>{user.age}</RnText>
        <RnText style={styles.infoLabel}>Gender: </RnText>
        <RnText style={styles.infoValue}>
          {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
        </RnText>
      </View>
      <View style={styles.infoRow}>
        <RnText style={styles.infoLabel}>Match Score: </RnText>
        <RnText style={styles.matchScore}>{user.matchScore}%</RnText>
      </View>
      <View style={styles.contactColumn}>
        <View style={styles.contactRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={wp(4)} color={Colors[theme].pink} />
          </View>
          <RnText style={styles.contactText}>{user.phone}</RnText>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="email"
              size={wp(4)}
              color={Colors[theme].pink}
            />
          </View>
          <RnText style={styles.contactText}>{user.email}</RnText>
        </View>
      </View>
      <View style={styles.radioGroup}>
        {["approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            style={styles.radioButton}
            onPress={() => handleStatusChange(status as UserStatus)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.radioOuter,
                status === "approved" && styles.radioApproved,
                status === "rejected" && styles.radioRejected,
                selectedOption === status &&
                  (status === "approved"
                    ? styles.radioApprovedSelected
                    : styles.radioRejectedSelected),
              ]}
            >
              {selectedOption === status && <View style={styles.radioInner} />}
            </View>
            <RnText
              style={[
                styles.radioLabel,
                status === "approved" && styles.radioLabelApproved,
                status === "rejected" && styles.radioLabelRejected,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </RnText>
          </TouchableOpacity>
        ))}
      </View>
    </RnContainer>
  );
}
