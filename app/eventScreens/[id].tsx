import createStyles from "@/app/eventScreens/styles/eventDetails.styles";
import RnButton from "@/components/RnButton";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { getUserByUidAsync, updateUser } from "@/firebase/auth";
import { fetchEventById, updateEvent } from "@/firebase/event";
import { RootState } from "@/redux/store";
import { wp } from "@/utils";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Share,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const EventDetails = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const params = useLocalSearchParams();
  const eventId = params.id as string;

  const { user } = useSelector((state: RootState) => state.user);

  const [event, setEvent] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = fetchEventById(eventId, (event: any) => {
      if (event) {
        setEvent(event);
        setCreator(event.creator);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [eventId]);

  // Fetch current user data from Firestore
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserByUidAsync(user.uid);
          setCurrentUserData(userData);
        } catch (error) {
          console.error("Error fetching current user data:", error);
        }
      }
    };

    fetchCurrentUserData();
  }, [user]);

  useEffect(() => {
    if (currentUserData && event) {
      const favouriteEvents = currentUserData.favouriteEvents || [];
      setIsLiked(favouriteEvents.includes(eventId));
    }
  }, [currentUserData, event, eventId]);

  const convertTimestampToDate = (timestamp: any) => {
    if (!timestamp) return null;

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      return timestamp;
    } else {
      return new Date(timestamp);
    }
  };

  const formatEventDate = (date: any) => {
    if (!date) return "";
    const dateObj = convertTimestampToDate(date);
    if (!dateObj || isNaN(dateObj.getTime())) return "";

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

    const dayOfMonth = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    return `${dayOfMonth}${getDaySuffix(dayOfMonth)} ${month}`;
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

  const formatEventTime = (time: any) => {
    if (!time) return "";
    const timeObj = convertTimestampToDate(time);
    if (!timeObj || isNaN(timeObj.getTime())) return "";

    const hours = timeObj.getHours();
    const minutes = timeObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleFavourite = async () => {
    if (!user?.uid || !event) return;

    try {
      const currentFavouriteEvents = currentUserData?.favouriteEvents || [];
      const currentFavouriteCount = event.favouriteCount || 0;

      let newFavouriteEvents: string[];
      let newFavouriteCount: number;

      if (isLiked) {
        // Remove event from user's favouriteEvents array
        newFavouriteEvents = currentFavouriteEvents.filter(
          (id: string) => id !== eventId
        );
        newFavouriteCount = Math.max(0, currentFavouriteCount - 1);
      } else {
        // Add event to user's favouriteEvents array
        newFavouriteEvents = [...currentFavouriteEvents, eventId];
        newFavouriteCount = currentFavouriteCount + 1;
      }

      // Update user's favouriteEvents array
      await updateUser(
        user.uid,
        {
          favouriteEvents: newFavouriteEvents,
        },
        dispatch
      );

      // Update event's favouriteCount
      await updateEvent(eventId, { favouriteCount: newFavouriteCount });

      // Update local state
      setIsLiked(!isLiked);
      setCurrentUserData((prev: any) => ({
        ...prev,
        favouriteEvents: newFavouriteEvents,
      }));
      setEvent((prev: any) => ({
        ...prev,
        favouriteCount: newFavouriteCount,
      }));
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  if (!event) {
    return (
      <View style={styles.mainContainer}>
        <ScrollContainer>
          <RnText>Loading...</RnText>
        </ScrollContainer>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollContainer customStyle={{ paddingHorizontal: 0 }}>
        <View style={styles.backgroundImageContainer}>
          <ImageBackground
            source={{ uri: event.image }}
            style={styles.backgroundImage}
          >
            <View style={styles.header}>
              <RoundButton
                iconName="arrow-back"
                iconSize={22}
                backgroundColour={Colors[theme].background}
                iconColor={Colors[theme].primary}
                onPress={() => router.back()}
              />
              <View style={styles.subheader}>
                <RoundButton
                  iconName="share"
                  iconSize={22}
                  backgroundColour={Colors[theme].background}
                  iconColor={Colors[theme].primary}
                  onPress={() =>
                    Share.share({
                      message: `Check out this event: ${event.name}`,
                      url: "https://www.google.com",
                    })
                  }
                />
                <RoundButton
                  iconName={isLiked ? "favorite" : "favorite-outline"}
                  iconSize={22}
                  backgroundColour={Colors[theme].background}
                  iconColor={
                    isLiked ? Colors[theme].pink : Colors[theme].primary
                  }
                  onPress={handleFavourite}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>Venue</RnText>
          <View style={styles.venueRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText style={styles.sectionText}>{event.venue}</RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons
              name="drama-masks"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText style={styles.sectionText}>{event.genre}</RnText>
            <View style={{ width: wp(4) }} />
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText style={styles.sectionText}>
              {formatEventDate(event.date)}
            </RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons
              name="clock-time-five-outline"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText style={styles.sectionText}>
              {formatEventTime(event.time)}
            </RnText>
          </View>
        </View>
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>Creator</RnText>
          <View style={styles.creatorRow}>
            <Image
              source={{ uri: creator?.image }}
              style={styles.creatorImage}
            />
            <RnText style={styles.creatorName}>
              {creator?.label || creator?.name || "Creator"}
            </RnText>
            <View style={{ flex: 1 }} />
            <RnText style={styles.likesText}>
              {event.favouriteCount || 0}
            </RnText>
            <FontAwesome
              name="heart-o"
              size={20}
              color={Colors[theme].pink}
              style={{ marginLeft: wp(1) }}
            />
          </View>
        </View>
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>About this event</RnText>
          <RnText style={styles.aboutText}>
            {event.description ||
              "Join us for an amazing event! This is a fantastic opportunity to experience something truly special."}
          </RnText>
        </View>
      </ScrollContainer>
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <RnText style={styles.priceText}>
            {event.normalPrice === "0" ? "Free" : `₹${event.normalPrice}`}
          </RnText>
        </View>
        <RnButton
          style={[styles.buyButton, styles.buyText]}
          onPress={() => router.push(`/eventScreens/tickets/${eventId}`)}
          title="Buy Tickets"
        />
      </View>
    </View>
  );
};

export default EventDetails;
