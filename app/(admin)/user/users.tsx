import createStyles from "@/app/adminStyles/user.styles";
import RnContainer from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { adminUsers } from "@/constants/adminUsers";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserStatus } from "@/types/Admin";
import { wp } from "@/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

const USERS_PER_PAGE = 9;
const PAGES = Math.ceil(adminUsers.length / USERS_PER_PAGE);

export default function AdminUsers() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [userStatuses, setUserStatuses] = useState(() =>
    adminUsers.reduce((acc, user) => {
      acc[user.id] = "pending";
      return acc;
    }, {} as Record<string, UserStatus>)
  );

  const [page, setPage] = useState(1);
  const pagedUsers = useMemo(() => {
    const start = (page - 1) * USERS_PER_PAGE;
    return adminUsers.slice(start, start + USERS_PER_PAGE);
  }, [page]);

  const handleStatusChange = (id: string, status: UserStatus) => {
    setUserStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [page]);

  const renderUserItem = ({ item: user }: { item: (typeof adminUsers)[0] }) => (
    <View style={styles.userCard}>
      <View
        style={[
          styles.statusTag,
          userStatuses[user.id] === "approved" && styles.statusTagApproved,
          userStatuses[user.id] === "rejected" && styles.statusTagRejected,
          userStatuses[user.id] === "pending" && styles.statusTagPending,
        ]}
      >
        <RnText style={styles.statusTagText}>
          {userStatuses[user.id].charAt(0).toUpperCase() +
            userStatuses[user.id].slice(1)}
        </RnText>
      </View>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <RnText style={styles.userName}>{user.name}</RnText>
      <RnText style={styles.userBio}>{user.bio}</RnText>
      <View style={styles.userInfoRow}>
        <RnText style={styles.userInfoLabel}>Age: </RnText>
        <RnText style={styles.userInfoValue}>{user.age}</RnText>
        <RnText style={styles.userInfoLabel}>Gender: </RnText>
        <RnText style={styles.userInfoValue}>
          {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
        </RnText>
      </View>
      <View style={styles.userInfoRow}>
        <RnText style={styles.userInfoLabel}>Match Score </RnText>
        <RnText style={styles.matchScore}>{user.matchScore}%</RnText>
      </View>
      <View style={styles.contactColumn}>
        <View style={styles.contactRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={wp(4)} color={Colors[theme].pink} />
          </View>
          <RnText
            style={[styles.contactText, { maxWidth: wp(30) }]}
            numberOfLines={1}
          >
            {user.phone}
          </RnText>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="email"
              size={wp(4)}
              color={Colors[theme].pink}
            />
          </View>
          <RnText
            style={[styles.contactText, { maxWidth: wp(30) }]}
            numberOfLines={1}
          >
            {user.email}
          </RnText>
        </View>
      </View>
      {userStatuses[user.id] === "pending" && (
        <View style={styles.radioGroup}>
          {["approved", "rejected"].map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.radioButton}
              onPress={() => handleStatusChange(user.id, status as UserStatus)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  status === "approved" && styles.radioApproved,
                  status === "rejected" && styles.radioRejected,
                  userStatuses[user.id] === status &&
                    (status === "approved"
                      ? styles.radioApprovedSelected
                      : styles.radioRejectedSelected),
                ]}
              >
                {userStatuses[user.id] === status && (
                  <View style={styles.radioInner} />
                )}
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
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <MaterialIcons
          name="chevron-left"
          size={wp(7)}
          color={theme === "light" ? Colors[theme].pink : Colors[theme].pink}
        />
      </TouchableOpacity>
      {Array.from({ length: PAGES }, (_, i) => i + 1).map((p) => (
        <TouchableOpacity
          key={p}
          style={[
            styles.paginationButton,
            page === p && styles.paginationActive,
          ]}
          onPress={() => setPage(p)}
        >
          <RnText
            style={[
              styles.paginationText,
              page === p && styles.paginationTextActive,
            ]}
          >
            {p}
          </RnText>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={() => setPage(Math.min(PAGES, page + 1))}
        disabled={page === PAGES}
      >
        <MaterialIcons
          name="chevron-right"
          size={wp(7)}
          color={theme === "light" ? Colors[theme].pink : Colors[theme].pink}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>User</RnText>
      <FlatList
        ref={flatListRef}
        data={pagedUsers}
        keyExtractor={(user, idx) => user.id + idx}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.flatlistColumnWrapper}
        style={styles.flatlist}
        contentContainerStyle={styles.flatlistContainer}
        renderItem={renderUserItem}
        ListFooterComponent={renderFooter}
      />
    </RnContainer>
  );
}
