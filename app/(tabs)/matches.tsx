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
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

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
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentAuth();
      if (currentUser?.currentUser?.uid) {
        const userMatches = await fetchUserMatches(currentUser.currentUser.uid);
        setMatches(userMatches);
        setTotalMatches(userMatches.length);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchPress = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      setShowMatchModal(true);
    }
  };

  const handleMessagePress = () => {
    setShowMatchModal(false);
    router.push("/(tabs)/messages");
  };

  const handleCloseModal = () => {
    setShowMatchModal(false);
    setSelectedMatch(null);
  };

  const modalStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: Colors[theme].background,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      marginHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[theme].redText,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].blackText,
      marginBottom: 30,
      textAlign: 'center',
      lineHeight: 22,
    },
    messageButton: {
      backgroundColor: Colors[theme].pink,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 25,
      minWidth: 120,
    },
    messageButtonText: {
      color: Colors[theme].whiteText,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

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
                onPress={() => handleMatchPress(item.id)}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
            style={{ width: wp(100) }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <RnText style={{ color: Colors[theme].tabIconDefault }}>
                    No matches yet. Start swiping to find matches!
                  </RnText>
                </View>
              ) : null
            }
          />
        </View>
      </View>

      {/* Match Modal */}
      <RnModal 
        show={showMatchModal} 
        backButton={handleCloseModal}
        backDrop={handleCloseModal}
      >
        <View style={modalStyles.modalContainer}>
          <RnText style={modalStyles.title}>It's a match</RnText>
          <RnText style={modalStyles.subtitle}>
            Start a conversation now with each other
          </RnText>
          <TouchableOpacity 
            style={modalStyles.messageButton}
            onPress={handleMessagePress}
          >
            <RnText style={modalStyles.messageButtonText}>Message</RnText>
          </TouchableOpacity>
        </View>
      </RnModal>
    </ScrollContainer>
  );
}
