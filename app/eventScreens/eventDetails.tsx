import createStyles from "@/app/eventScreens/styles/eventDetails.styles";
import RnButton from "@/components/RnButton";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { hp, wp } from "@/utils";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Share,
  useColorScheme,
  View,
} from "react-native";

const EventDetails = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <View style={styles.mainContainer}>
      <ScrollContainer
        customStyle={{ paddingHorizontal: 0, paddingBottom: hp(2) }}
      >
        <View style={styles.backgroundImageContainer}>
          <ImageBackground
            source={{
              uri: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400",
            }}
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
                      message: "Check out this event https://www.google.com",
                      url: "https://www.google.com",
                    })
                  }
                />
                <RoundButton
                  iconName="favorite"
                  iconSize={22}
                  backgroundColour={Colors[theme].background}
                  iconColor={Colors[theme].primary}
                />
              </View>
            </View>
            <View>
              <View style={styles.datePlaceContainer}>
                <RnText style={styles.dateText}>13th March</RnText>
                <Entypo
                  name="dot-single"
                  size={30}
                  color={Colors[theme].whiteText}
                />
                <RnText style={styles.dateText}>Ahmedabad</RnText>
              </View>
              <RnText style={styles.nameText}>Ghar by Zakir Khan</RnText>
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
            <RnText>The Cheese Box Studios, Ahmedabad</RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons
              name="drama-masks"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText>Comedy</RnText>
            <View style={{ width: wp(4) }} />
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText>13th Mar, Saturday</RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons
              name="clock-time-five-outline"
              size={20}
              color={Colors[theme].pink}
            />
            <RnText>7:00 - 9:00 PM</RnText>
          </View>
        </View>
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>Creator</RnText>
          <View style={styles.creatorRow}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
              }}
              style={styles.creatorImage}
            />
            <RnText style={styles.creatorName}>Zakir Khan</RnText>
            <View style={{ flex: 1 }} />
            <RnText style={styles.likesText}>5.6K</RnText>
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
            Zakir Khan is well known for his comedy timing and{"\n"}his
            storytelling is also popular amongst the young people Zakir Khan is
            well known for his comedy timing and{"\n"}his storytelling is also
            popular amongst the young people Zakir Khan is well known for his
            comedy timing and{"\n"}his storytelling is also popular amongst the
            young people
          </RnText>
        </View>
      </ScrollContainer>
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <RnText style={styles.priceText}>500 ₹</RnText>
        </View>
        <RnButton
          style={[styles.buyButton, styles.buyText]}
          onPress={() => router.push("/eventScreens/ticketDetails")}
          title="Buy Tickets"
        />
      </View>
    </View>
  );
};

export default EventDetails;
