import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { GalleryImage } from "@/firebase/gallery";
import { encodeImagePath, hp, wp } from "@/utils";
import { formatTimeAgo } from "@/utils/FormatDate";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnText from "./RnText";

interface GalleryCardProps {
  image: GalleryImage;
  onLike: () => void;
  onDislike: () => void;
  optimisticLikes?: number;
  optimisticDislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  image,
  onLike,
  onDislike,
  optimisticLikes,
  optimisticDislikes,
  isLiked,
  isDisliked,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      {/* User info at the top */}
      <View style={styles.topContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: encodeImagePath(image.userPhoto) }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <RnText style={styles.userName}>{image.username}</RnText>
            <RnText style={styles.timeAgo}>
              {formatTimeAgo(image.createdAt)}
            </RnText>
          </View>
        </View>
      </View>

      {/* Action buttons at the bottom */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Ionicons
            name="heart"
            size={24}
            color={isLiked ? Colors[theme].redText : Colors[theme].whiteText}
          />
          {(optimisticLikes !== undefined
            ? optimisticLikes
            : image.likes?.length || 0) > 0 && (
            <RnText style={styles.actionCount}>
              {optimisticLikes !== undefined
                ? optimisticLikes
                : image.likes?.length || 0}
            </RnText>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onDislike}>
          <Ionicons
            name="heart-dislike"
            size={24}
            color={isDisliked ? Colors[theme].redText : Colors[theme].whiteText}
          />
          {(optimisticDislikes !== undefined
            ? optimisticDislikes
            : image.dislikes?.length || 0) > 0 && (
            <RnText style={styles.actionCount}>
              {optimisticDislikes !== undefined
                ? optimisticDislikes
                : image.dislikes?.length || 0}
            </RnText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    card: {
      width: wp(92),
      height: hp(50),
      borderRadius: Borders.radius3,
      overflow: "hidden",
      marginBottom: hp(2),
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    topContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: wp(4),
      paddingTop: hp(2),
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      marginRight: wp(3),
      borderWidth: 2,
      borderColor: Colors[theme].whiteText,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
    },
    timeAgo: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.extraSmall,
      opacity: 0.8,
      marginTop: hp(0.5),
    },
    bottomActions: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: wp(4),
      paddingBottom: hp(2),
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    actionButton: {
      marginHorizontal: wp(8),
      paddingVertical: hp(1),
      paddingHorizontal: wp(3),
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: Borders.radius2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    actionCount: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.semiBold,
      marginLeft: wp(2),
    },
  });

export default GalleryCard;
