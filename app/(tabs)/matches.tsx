import createStyles from "@/app/tabStyles/matches.styles";
import MatchCard from "@/components/MatchCard";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { fetchUserMatches, getCurrentAuth } from "@/firebase/auth";
import { wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";

type Match = {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  matchPercentage: number;
};

export default function Matches() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [likedCount, setLikedCount] = useState(0);
  const [connectCount, setConnectCount] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentAuth();
        if (currentUser?.currentUser?.uid) {
          const userMatches = await fetchUserMatches(
            currentUser.currentUser.uid
          );
          setMatches(userMatches);
        }
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
    loadCounts();
  }, []);

  const loadCounts = async () => {
    const currentUser = await getCurrentAuth();
    const currentUserId = currentUser?.currentUser?.uid;

    if (!currentUserId) return;

    const db = getFirestore();

    // 1. Get users who liked **me**
    const usersRef = collectionGroup(db, "likes");
    const allLikesSnap = await getDocs(usersRef);

    // 2. Filter only those who liked the current user
    const likedByUsers = allLikesSnap.docs
      .filter(doc => doc.id === currentUserId)
      .map(doc => doc.ref.parent.parent?.id)
      .filter(Boolean) as string[]; // Remove nulls

    let mutualConnections = 0;

    // 3. Check if I also liked them (mutual)
    for (const likerId of likedByUsers) {
      const myLikeRef = doc(db, "users", currentUserId, "likes", likerId);
      const myLikeDoc = await getDoc(myLikeRef);

      if (myLikeDoc.exists()) {
        mutualConnections += 1;
      }
    }

    // 4. Update counts
    setLikedCount(likedByUsers.length - mutualConnections); // only one-sided likes
    setConnectCount(mutualConnections); // mutual
  };

  return (
    <ScrollContainer>
      {/* Header */}
      <View style={styles.headerContainer}>
        <RnText style={styles.headerTitle}>Matches</RnText>
        <RoundButton
          iconName="more-vert"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
        />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => router.push("/mainScreens/LikesCount?type=likes")}
        >
          <View
            style={[
              styles.statCircle,
              { backgroundColor: Colors[theme].redText },
            ]}
          >
            <Ionicons name="heart" size={20} color={Colors[theme].background} />
          </View>
          <View style={styles.statTextContainers}>
            <RnText style={styles.statLabel}>Likes</RnText>
            <RnText style={styles.statNumber}>{likedCount}</RnText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statItem}
          onPress={() =>
            router.push("/mainScreens/LikesCount?type=connections")
          }
        >
          <View
            style={[
              styles.statCircle,
              { backgroundColor: Colors[theme].greenText },
            ]}
          >
            <Ionicons
              name="people"
              size={20}
              color={Colors[theme].background}
            />
          </View>
          <View style={styles.statTextContainers}>
            <RnText style={styles.statLabel}>Connect</RnText>
            <RnText style={styles.statNumber}>{connectCount}</RnText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Your Matches Section */}
      <View>
        <View style={styles.statTextContainers}>
          <RnText style={styles.sectionTitle}>Your Matches </RnText>
          <RnText
            style={[styles.sectionTitle, { color: Colors[theme].redText }]}
          >
            {connectCount}
          </RnText>
        </View>

        <View style={styles.section}>
          <FlatList
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({ item }: { item: any }) => (
              <MatchCard
                id={item.id}
                name={item.name}
                age={item.age}
                // location={item.location}
                distance={item.distance}
                image={item.image}
                matchPercentage={item.matchPercentage}
                // onPress={() =>
                //   // handleMatchPress(item.userId, item.status, item.id)'\
                //   conso
                // }
                isPending={item.status == "pending"}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
            style={{ width: wp(100) }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <RnText style={{ color: Colors[theme].tabIconDefault }}>
                    No matches yet. Start swiping to find matches!
                  </RnText>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </ScrollContainer>
  );
}
