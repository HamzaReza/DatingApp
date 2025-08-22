import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { GalleryImage } from "@/firebase/gallery";
import { encodeImagePath, hp, wp } from "@/utils";
import { formatTimeAgo } from "@/utils/FormatDate";
import { AntDesign } from "@expo/vector-icons";
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
        resizeMode="contain"
      />

      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.bottomContainer}>
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
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <AntDesign
            name="like1"
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
          <AntDesign
            name="dislike1"
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
      flexDirection: "row",
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
    content: {
      flex: 1,
      padding: wp(6),
      justifyContent: "flex-end",
    },
    bottomContainer: {
      marginTop: hp(2),
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: wp(12),
      height: wp(12),
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
    actions: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: "rgba(255,255,255,0.4)",
      padding: hp(1.5),
      borderTopLeftRadius: hp(2.5),
      borderBottomLeftRadius: hp(2.5),
    },
    actionButton: {
      alignItems: "center",
      marginVertical: hp(0.5),
    },
    actionCount: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.extraSmall,
      fontFamily: FontFamily.semiBold,
      marginTop: hp(0.5),
    },
  });

export default GalleryCard;
