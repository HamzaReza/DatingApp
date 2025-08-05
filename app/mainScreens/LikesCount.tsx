import MatchCard from "@/components/MatchCard";
import Container from "@/components/RnContainer";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { getCurrentAuth } from "@/firebase/auth";
import { hp, wp } from "@/utils";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function LikesAndConnections() {
  const { type } = useLocalSearchParams(); // 'likes' or 'connections'
  const tabType = type === "likes" ? "Likes" : "Connections";
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Likes" | "Connections">(tabType);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    let isMounted = true;
    setLoading(true); // Start loading

    const calculateMatchScore = (userA: any, userB: any) => {
      if (!userA || !userB) return 0;

      let score = 0;
      const total = 3;

      if (userA.intent === userB.intent) score++;
      if (userA.profileScore && userB.profileScore) {
        const diff = Math.abs(userA.profileScore - userB.profileScore);
        if (diff <= 20) score++;
      }
      if (userA.userId !== userB.userId) score++; // simple uniqueness check

      return Math.round((score / total) * 100); // percentage
    };

    const fetchUsers = async () => {
      try {
        const currentUser = await getCurrentAuth();
        const currentUserId = currentUser?.currentUser?.uid;
        if (!currentUserId) return;

        const db = getFirestore();

        // Get current user's full data
        const currentUserSnap = await getDoc(doc(db, "users", currentUserId));
        const currentUserData = currentUserSnap.exists()
          ? currentUserSnap.data()
          : null;
        if (!currentUserData) return;

        const likesSnap = await getDocs(collectionGroup(db, "likes"));
        const likedMeUserIds = likesSnap.docs
          .filter((doc: any) => doc.id === currentUserId)
          .map((doc: any) => doc.ref.parent.parent?.id)
          .filter(Boolean);

        const userFetches = likedMeUserIds.map(async (likerId: any) => {
          if (!likerId) return null;

          const [likerDocSnap, mutualLikeSnap] = await Promise.all([
            getDoc(doc(db, "users", likerId)),
            getDoc(doc(db, "users", currentUserId, "likes", likerId)),
          ]);

          if (!likerDocSnap.exists()) return null;

          const userData: any = likerDocSnap.data();
          const likedAtTimestamp = mutualLikeSnap.exists()
            ? mutualLikeSnap.data()?.likedAt
            : null;

          const likedAt =
            likedAtTimestamp && likedAtTimestamp.toDate
              ? likedAtTimestamp.toDate().toLocaleString()
              : null;

          const matchPercentage = calculateMatchScore(
            {
              userId: currentUserId,
              intent: currentUserData.lookingFor,
              profileScore: currentUserData.profileScore,
            },
            {
              userId: likerId,
              intent: userData.lookingFor,
              profileScore: userData.profileScore,
            }
          );

          if (
            (activeTab === "Likes" && !mutualLikeSnap.exists()) ||
            (activeTab === "Connections" && mutualLikeSnap.exists())
          ) {
            return {
              id: likerId,
              name: userData.name,
              photo: userData.photo,
              likedAt,
              age: userData.age,
              location: "Location",
              distance: "10Km",
              matchPercentage, // ✅ added
            };
          }

          return null;
        });

        const results = (await Promise.all(userFetches)).filter(Boolean);

        if (isMounted) setUsers(results);
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const styles = StyleSheet.create({
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: Colors[theme].primaryOpaque,
      borderRadius: Borders.radius3,
      marginBottom: hp(1),
      padding: wp(1.5),
    },
    tab: {
      flex: 1,
      paddingVertical: hp(1),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Borders.radius3,
    },
    activeTab: {
      backgroundColor: Colors[theme].background,
      elevation: 2,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    tabText: {
      textAlign: "center",
      color: Colors[theme].greenText,
      fontFamily: FontFamily.semiBold,
    },
    activeTabText: {
      color: Colors[theme].redText,
      fontFamily: FontFamily.bold, // dont
    },
    scrollView: {
      marginHorizontal: 0,
      paddingHorizontal: 0,
    },
    flatListCon: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
      borderBottomColor: Colors[theme].gray,
      borderBottomWidth: 0.5,
      padding: hp(1),
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    name: {
      color: Colors[theme].blackText,
      fontFamily: FontFamily.bold,
    },
    titleContainer: {
      flexDirection: "row",
      marginBottom: hp(2),
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleText: {
      fontFamily: FontFamily.bold,
      color: Colors[theme].greenText,
      fontSize: FontSize.large,
    },
  });

  return (
    <Container>
      <View style={styles.titleContainer}>
        <RoundButton
          iconName="arrow-back"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.titleText}>
          {activeTab === "Likes" ? "People who liked you" : "Your connections"}
        </RnText>
        <View />
      </View>

      <ScrollContainer customStyle={styles.scrollView}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Likes" && styles.activeTab]}
            onPress={() => setActiveTab("Likes")}
          >
            <RnText
              style={[
                styles.tabText,
                activeTab === "Likes" && styles.activeTabText,
              ]}
            >
              Likes
            </RnText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Connections" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Connections")}
          >
            <RnText
              style={[
                styles.tabText,
                activeTab === "Connections" && styles.activeTabText,
              ]}
            >
              Connections
            </RnText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors[theme].primary}
            style={{ marginTop: hp(5) }}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MatchCard
                id={item.id}
                name={item.name}
                age={item.age}
                location={""}
                image={item.photo}
                matchPercentage={item.matchPercentage}
                distance={item.distance}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/discover/[id]",
                    params: {
                      id: item.id,
                    },
                  })
                }
                isPending={false}
              />
            )}
          />
        )}
      </ScrollContainer>
    </Container>
  );
}
