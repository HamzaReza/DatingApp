import createStyles from '@/app/eventScreens/styles/explore.styles';
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

import { hp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import CreatorShow from "./components/CreatorShow";
import UpcomingEventCard from "./components/upcomingEventCard";

// Add more dummy data
const CreatorShowData = [
  {
    title: "Laugh Riot",
    name: "Amit Sharma",
    date: "15 March",
    image: "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    title: "Music Fiesta",
    name: "Priya Singh",
    date: "20 March",
    image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    title: "Art Expo",
    name: "Rahul Verma",
    date: "25 March",
    image: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    title: "test",
    name: "test",
    date: "13 March",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
];




const explore = () => {


const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <ScrollContainer customStyle={styles.mainContainer}>
      {/* header */}
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="menu"
          iconSize={24}
          borderColor={Colors[theme].backgroundSecondary}
        />

        <View style={styles.locationContainer}>
          <RoundButton
            iconName="location-off"
            iconSize={22}
            iconColor={Colors[theme].primary}
            borderColor={Colors[theme].background}
          />
          <RnText>RajKat, Kujaraj</RnText>
        </View>

        <View style={styles.notificationContainer}>
          <RoundButton
            iconName="notifications"
            iconSize={22}
            iconColor={Colors[theme].primary}
            borderColor={Colors[theme].background}
            backgroundColour={Colors[theme].whiteText}
          />
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
            }}
            style={{ width: "100%", height: "100%", borderRadius: hp(5) / 2 }}
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Events, Creators, etc."
          placeholderTextColor={Colors[theme].tabIconDefault}
          style={styles.searchInput}
        />

        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color={Colors[theme].pink} />
        </View>
      </View>

      <View style={styles.upcomingEventsContainer}>
        <View></View>
        <RnText style={styles.upcomingEventsText}>Upcoming Events</RnText>
        <View style={styles.upcomingCardContainer}>
          <UpcomingEventCard
            backgroundImage="https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400"
            status="Upcoming"
            title={"Melody Madness"}
            date={"Mon, 26th Feb"}
            location={"Ahmedabad"}
          />
        </View>
      </View>
      <View style={styles.upcomingEventsContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <RnText style={styles.upcomingEventsText}>Creator’s Shows</RnText>
          <TouchableOpacity onPress={()=>router.push('/eventScreens/events')}>
            <RnText style={styles.btnTxt}>View All</RnText>
          </TouchableOpacity>
        </View>
        <View style={styles.creatorShowCardContainer}>
          <FlatList
  data={CreatorShowData}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(_, idx) => idx.toString()}
  renderItem={({ item }) => (
    <CreatorShow
      showDate={item.date}
      showName={item.name}
      showTitle={item.title}
      backgroundImage={item.image}
    />
  )}
/>
        </View>
      </View>


<View style={styles.upcomingEventsContainer}>
 <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <RnText style={styles.upcomingEventsText}>Events in your city</RnText>
          <TouchableOpacity>
            <RnText style={styles.btnTxt}>View All</RnText>
          </TouchableOpacity>
        </View>
</View>

    </ScrollContainer>
  );
};

export default explore;
