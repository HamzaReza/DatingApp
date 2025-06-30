import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

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
  return (
    <View style={styles.imageBackgroundContainer}>
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.eventStatusConatiner}>
          <RnText style={styles.statusText}>{status}</RnText>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.titleDateContainer}>
            <RnText style={styles.titleText}>{title}</RnText>
            <RnText style={styles.dateTimeText}>{date}</RnText>
          </View>
          <View style={styles.locationContainer}>
            <RnText style={styles.locationText}>{location}</RnText>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default UpcomingEventCard;

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: "100%",
    height: hp(24),
    alignSelf: "center",
    overflow: "hidden",
    marginVertical: hp(1),
    borderRadius: Borders.radius2,
    backgroundColor: Colors.light.gray,
  },
  imageBackground: {
    width: wp(100),
    height: hp(24),
    padding: wp(4),
    justifyContent: "space-between",
  },
  eventStatusConatiner: {
    borderRadius: Borders.radius2,
    backgroundColor: Colors.light.whiteText,
    padding: wp(0.5),
    paddingHorizontal: wp(2),
    alignSelf: "flex-start",
  },
  statusText: {
    color: Colors.light.pink,
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
    color: Colors.light.whiteText,
  },
  dateTimeText: {
    fontSize: FontSize.small,
    color: Colors.light.whiteText,
  },
  locationContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  locationText: {
    fontSize: FontSize.small,
    color: Colors.light.whiteText,
  },
});