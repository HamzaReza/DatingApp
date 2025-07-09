import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { wp } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  title: string;
  date: string;
  location: string;
  price: string;
  imageUrl: string;
};

const EventCard = ({ title, date, location, price, imageUrl }: Props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      <View style={styles.rightSection}>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.subInfo}>
            <Text style={styles.date}>{date}</Text>
            <Entypo name="dot-single" size={16} color="red" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity
            onPress={() => router.push("/eventScreens/eventDetails")}
            style={styles.joinNowContainer}
          >
            <Text style={styles.joinNow}>JOIN NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventCard;

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: "row",
      backgroundColor: Colors[theme].background,
      borderRadius: Borders.radius2,
      margin: wp(3),
      alignItems: "center",
    },
    imageContainer: {
      width: wp(18),
      height: wp(18),
      borderRadius: Borders.radius2,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    rightSection: {
      flexDirection: "row",
      marginLeft: wp(3),
    },
    infoContainer: {
      justifyContent: "center",
      marginRight: wp(2),
      width: wp(49),
    },
    title: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
      flexShrink: 1,
      flexWrap: "wrap",
      color: Colors[theme].blackText,
    },
    subInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: wp(1),
    },
    date: {
      color: Colors[theme].tabIconDefault,
      fontSize: FontSize.extraSmall,
    },
    location: {
      color: Colors[theme].tabIconDefault,
      fontSize: FontSize.extraSmall,
    },
    actionContainer: {
      alignItems: "flex-end",
      paddingVertical: wp(1),
    },
    price: {
      color: Colors[theme].redText,
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
    },
    joinNow: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.extraSmall,
      color: Colors[theme].redText,
    },
    joinNowContainer: {
      marginTop: wp(2),
      padding: wp(2),
      borderWidth: 1,
      borderColor: Colors[theme].redText,
      borderRadius: Borders.radius2,
    },
  });
