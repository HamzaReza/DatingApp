import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { hp, wp } from "@/utils";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type UpcomingEventCardProps = {
  backgroundImage: string;
  title: string;
  date: string;
  location: string;
  eventId: string;
};

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  backgroundImage,
  title,
  date,
  location,
  eventId,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedStyles = styles(theme);

  return (
    <TouchableOpacity
      style={themedStyles.imageBackgroundContainer}
      activeOpacity={1}
      onPress={() => router.push(`/eventScreens/${eventId}`)}
    >
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={themedStyles.imageBackground}
      >
        <View style={themedStyles.bottomContainer}>
          <View style={themedStyles.titleDateContainer}>
            <RnText style={themedStyles.titleText}>{title}</RnText>
            <RnText style={themedStyles.dateTimeText}>{date}</RnText>
          </View>
          <View style={themedStyles.locationContainer}>
            <RnText style={themedStyles.locationText}>{location}</RnText>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default UpcomingEventCard;

const styles = (theme: "dark" | "light") =>
  StyleSheet.create({
    imageBackgroundContainer: {
      width: wp(92),
      height: hp(24),
      alignSelf: "center",
      overflow: "hidden",
      marginVertical: hp(1),
      borderRadius: Borders.radius2,
      backgroundColor: Colors[theme].gray,
    },
    imageBackground: {
      width: wp(92),
      height: hp(24),
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: wp(3),
      paddingVertical: hp(1),
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    titleDateContainer: {
      width: wp(40),
    },
    titleText: {
      fontFamily: FontFamily.bold,
      color: Colors[theme].whiteText,
    },
    dateTimeText: {
      fontFamily: FontFamily.regular,
      color: Colors[theme].whiteText,
    },
    locationContainer: {
      alignSelf: "flex-end",
      alignItems: "flex-end",
      width: wp(40),
    },
    locationText: {
      fontFamily: FontFamily.medium,
      color: Colors[theme].whiteText,
    },
  });
