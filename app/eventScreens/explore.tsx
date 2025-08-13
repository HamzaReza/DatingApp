import createStyles from "@/app/eventScreens/styles/explore.styles";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  fetchAllFutureEvents,
  fetchCreatorsEvent,
  fetchNextUpcomingEvent,
} from "@/firebase/event";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, useColorScheme } from "react-native";
import CreatorShow from "./components/CreatorShow";
import UpcomingEventCard from "./components/upcomingEventCard";

const Explore = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [searchValue, setSearchValue] = useState("");
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = fetchNextUpcomingEvent(event => {
      setNextEvent(event);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = fetchCreatorsEvent(creatorsData => {
      setCreators(creatorsData);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = fetchAllFutureEvents(eventsData => {
      setAllEvents(eventsData);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Format date for display
  const formatEventDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}, ${dayOfMonth}${getDaySuffix(dayOfMonth)} ${month} ${year}`;
  };

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <ScrollContainer>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        {/* <RnText style={styles.locationText}>{address}</RnText> */}
        <RoundButton
          iconName="notifications-none"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
        />
      </View>

      <RnInput
        placeholder="Search Events, Creators, etc."
        containerStyle={styles.searchInput}
        value={searchValue}
        onChangeText={setSearchValue}
        rightIcon={
          <Ionicons name="search" size={20} color={Colors[theme].pink} />
        }
        noError
      />

      <View style={styles.upcomingEventsContainer}>
        <RnText style={styles.upcomingEventsText}>Upcoming Event</RnText>
        <View style={styles.upcomingCardContainer}>
          {nextEvent && (
            <UpcomingEventCard
              backgroundImage={nextEvent.image}
              title={nextEvent.name}
              date={formatEventDate(nextEvent.date)}
              location={nextEvent.venue}
              eventId={nextEvent.id}
            />
          )}
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
          <RnText style={styles.upcomingEventsText}>All Events</RnText>
          <TouchableOpacity onPress={() => router.push("/eventScreens/events")}>
            <RnText style={styles.btnTxt}>View All</RnText>
          </TouchableOpacity>
        </View>
        <View style={styles.creatorShowCardContainer}>
          <FlatList
            data={allEvents.slice(1)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CreatorShow
                showName={item.name}
                backgroundImage={item.image}
                onPress={() => router.push(`/eventScreens/${item.id}`)}
              />
            )}
          />
        </View>
      </View>
      <View style={styles.upcomingEventsContainer}>
        <RnText style={styles.upcomingEventsText}>{`Creator's Shows`}</RnText>
        <View style={styles.creatorShowCardContainer}>
          <FlatList
            data={creators}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CreatorShow
                showName={item.name}
                backgroundImage={item.image}
                onPress={() =>
                  router.push({
                    pathname: "/eventScreens/events",
                    params: { creatorId: item.id },
                  })
                }
              />
            )}
          />
        </View>
      </View>
    </ScrollContainer>
  );
};

export default Explore;
