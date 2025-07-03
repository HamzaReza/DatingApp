import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnText from "./RnText";

interface UserCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  isNew?: boolean;
  onPress?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  age,
  location,
  distance,
  image,
  isNew = false,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.overlay} />

      {isNew && (
        <View style={styles.newBadge}>
          <RnText style={styles.newText}>NEW</RnText>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.nameCon}>
          <RnText style={styles.distance}>{distance}</RnText>
        </View>

        <RnText style={styles.name}>
          {name}, {age}
        </RnText>
        <View style={styles.locationContainer}>
          <RnText style={styles.location}>{location}</RnText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    card: {
      width: wp(28),
      height: hp(22),
      borderRadius: wp(4),
      overflow: "hidden",
      marginRight: wp(3),
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    newBadge: {
      position: "absolute",
      top: wp(2),
      left: wp(2),
      backgroundColor: Colors[theme].redText,
      paddingHorizontal: wp(2),
      paddingVertical: wp(1),
      borderRadius: Borders.radius1,
    },
    newText: {
      color: Colors[theme].background,
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.bold,
    },
    content: {
      position: "absolute",
      bottom: wp(2),
      left: wp(2),
      right: wp(2),
    },
    name: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.bold,
      marginBottom: hp(0.5),
      textAlign: "center",
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(0.3),
      justifyContent: "center",
    },
    location: {
      color: Colors[theme].background,
      fontSize: FontSize.extraSmall,
      marginLeft: wp(1),
      textTransform: "uppercase",
    },
    distance: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.extraSmall,
      opacity: 0.8,
      textAlign: "center",
      fontFamily: FontFamily.semiBold,
    },
    nameCon: {
      paddingVertical: wp(1),
      paddingHorizontal: wp(0.1),
      borderRadius: Borders.circle,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderColor: Colors[theme].whiteText,
      borderWidth: 0.3,
    },
  });

export default UserCard;
