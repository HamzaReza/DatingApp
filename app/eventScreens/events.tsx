import createStyles from "@/app/eventScreens/styles/events.styles";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { FlatList, useColorScheme, View } from "react-native";
import EventCard from "./components/EventCard";

const dummyEvents = [
  {
    id: "1",
    title: "Designers Meetup 2022",
    date: "03 October, 22",
    location: "Gulshan, Dhaka",
    price: "$10. USD",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
  {
    id: "2",
    title: "Developers Conference",
    date: "12 November, 22",
    location: "Colombo, SL",
    price: "$25. USD",
    imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f",
  },
  {
    id: "3",
    title: "Tech Bootcamp 2023",
    date: "01 Jan, 23",
    location: "Bangalore, India",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
];

const Events = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <Container>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          borderColor={Colors[theme].background}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerText}>Events</RnText>
        <RoundButton
          iconName="more-vert"
          iconSize={22}
          iconColor={Colors[theme].primary}
          borderColor={Colors[theme].background}
          backgroundColour={Colors[theme].whiteText}
        />
      </View>

      <View style={styles.detailsContainer}>
        <FlatList
          data={dummyEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              title={item.title}
              date={item.date}
              location={item.location}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Container>
  );
};

export default Events;
