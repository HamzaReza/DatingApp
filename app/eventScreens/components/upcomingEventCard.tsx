import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import { ImageBackground, StyleSheet, View, useColorScheme } from "react-native";

type UpcomingEventCardProps = {
  backgroundImage: string;
  status: string;
  title: string;
  date: string;
  location: string;
};

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  backgroundImage,
  status,
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
        resizeMode="cover"
      >
        <View style={themedStyles.eventStatusConatiner}>
          <RnText style={themedStyles.statusText}>{status}</RnText>
        </View>

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

const styles = (theme: 'dark' | 'light') => StyleSheet.create({
  imageBackgroundContainer: {
    width: "100%",
    height: hp(24),
    alignSelf: "center",
    overflow: "hidden",
    marginVertical: hp(1),
    borderRadius: Borders.radius2,
    backgroundColor: Colors[theme].gray,
  },
  imageBackground: {
    width: wp(100),
    height: hp(24),
    padding: wp(4),
    justifyContent: "space-between",
  },
  eventStatusConatiner: {
    borderRadius: Borders.radius2,
    backgroundColor: Colors[theme].whiteText,
    padding: wp(0.5),
    paddingHorizontal: wp(2),
    alignSelf: "flex-start",
  },
  statusText: {
    color: Colors[theme].pink,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(10),
  },
  titleDateContainer: {
    marginLeft: wp(2),
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
    alignItems: "flex-end",
    flexDirection: "row",
  },
  locationText: {
    fontSize: FontSize.small,
    color: Colors[theme].whiteText,
  },
});