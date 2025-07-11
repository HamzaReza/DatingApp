import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

type UpcomingEventCardProps = {
  backgroundImage: string;
  title: string;
  date: string;
  location: string;
};

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  backgroundImage,
  title,
  date,
  location,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedStyles = styles(theme);

  return (
    <View style={themedStyles.imageBackgroundContainer}>
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
    </View>
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
      bottom: hp(2),
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: wp(3),
    },
    titleDateContainer: {
      width: wp(40),
    },
    titleText: {
      fontSize: FontSize.medium,
      marginBottom: wp(2),
      color: Colors[theme].whiteText,
    },
    dateTimeText: {
      fontSize: FontSize.small,
      color: Colors[theme].whiteText,
    },
    locationContainer: {
      alignSelf: "flex-end",
      alignItems: "flex-end",
      width: wp(40),
    },
    locationText: {
      fontSize: FontSize.small,
      color: Colors[theme].whiteText,
    },
  });
