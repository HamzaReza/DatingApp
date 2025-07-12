import createStyles from "@/app/eventScreens/styles/events.styles";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import {
  fetchAllFutureEvents,
  fetchEventsByCreatorId,
  formatDate,
} from "@/firebase/event";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, useColorScheme, View } from "react-native";
import EventCard from "./components/EventCard";

const Events = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const params = useLocalSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchEvents = () => {
      if (params.creatorId) {
        unsubscribe = fetchEventsByCreatorId(
          params.creatorId as string,
          creatorEvents => {
            setEvents(creatorEvents);
            setLoading(false);
          }
        );
      } else {
        unsubscribe = fetchAllFutureEvents(allEvents => {
          setEvents(allEvents);
          setLoading(false);
        });
      }
    };

    fetchEvents();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [params.creatorId]);

  // const formatEventData = (event: any) => {
  //   const eventDate = event.date ? new Date(event.date) : null;
  //   const formattedDate = eventDate
  //     ? eventDate.toLocaleDateString("en-US", {
  //         day: "2-digit",
  //         month: "long",
  //         year: "2-digit",
  //       })
  //     : "TBD";

  //   return {
  //     id: event.id,
  //     title: event.name || event.title,
  //     date: formattedDate,
  //     location: event.venue || event.location || "Location TBD",
  //     price: event.price || "Free",
  //     imageUrl:
  //       event.image ||
  //       event.imageUrl ||
  //       "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  //   };
  // };

  return (
    <Container>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerText}>
          {params.creatorId ? "Creator Events" : "Events"}
        </RnText>
        <RoundButton noShadow />
      </View>

      <View style={styles.detailsContainer}>
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <EventCard
                title={item.name}
                date={formatDate(item.date).toISOString()}
                location={item.venue}
                price={
                  item.normalPrice === "0" ? "Free" : `₹${item.normalPrice}`
                }
                imageUrl={item.image}
                id={item.id}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 50,
                }}
              >
                <RnText
                  style={{ color: Colors[theme].blackText, fontSize: 16 }}
                >
                  {params.creatorId
                    ? "No events found for this creator"
                    : "No upcoming events found"}
                </RnText>
              </View>
            ) : null
          }
        />
      </View>
    </Container>
  );
};

export default Events;
