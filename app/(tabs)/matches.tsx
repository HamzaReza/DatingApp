import createStyles from "@/app/tabStyles/matches.styles";
import MatchCard from "@/components/MatchCard";
import RnModal from "@/components/RnModal";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { fetchUserMatches, getCurrentAuth } from "@/firebase/auth";
import { wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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

  const [likedCount] = useState(32);
  const [connectCount] = useState(16);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    console.log("matches", matches);
  }, [matches]);

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
  }, []);

  const handleMatchPress = (
    userId: string,
    status: string,
    matchId: string
  ) => {
    if (status == "pending") {
      return;
    }
    router.push(`/(tabs)/discover/${userId}`);
    setShowMatchModal(false);
  };

  const handleMessagePress = () => {
    setShowMatchModal(false);
    router.push("/(tabs)/messages");
  };

  const handleCloseModal = () => {
    setShowMatchModal(false);
    setSelectedMatch(null);
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
        <View style={styles.statItem}>
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
        </View>

        <View style={styles.statItem}>
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
        </View>
      </View>

      {/* Your Matches Section */}
      <View>
        <View style={styles.statTextContainers}>
          <RnText style={styles.sectionTitle}>Your Matches</RnText>
          <RnText
            style={[styles.sectionTitle, { color: Colors[theme].redText }]}
          >
            {totalMatches}
          </RnText>
        </View>

        <View style={styles.section}>
          <FlatList
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MatchCard
                id={item.id}
                name={item.name}
                age={item.age}
                location={item.location}
                distance={item.distance}
                image={item.image}
                matchPercentage={item.matchPercentage}
                onPress={() =>
                  handleMatchPress(item.userId, item.status, item.id)
                }
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
