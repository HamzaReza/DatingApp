import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { Reel } from "@/firebase/reels";
import { hp, wp } from "@/utils";
import { encodeImagePath } from "@/utils/EncodedImage";
import { formatTimeAgo } from "@/utils/FormatDate";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnText from "./RnText";

interface ReelCardProps {
  reel: Reel;
  onLike: () => void;
  onDislike: () => void;
  onComment: () => void;
  onPress: () => void;
  optimisticLikes?: number;
  optimisticDislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  onLike,
  onDislike,
  onComment,
  onPress,
  optimisticLikes,
  optimisticDislikes,
  isLiked,
  isDisliked,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: reel.thumbnailUrl || reel.videoUrl }}
        style={styles.thumbnailImage}
      />
      <View style={styles.overlay} />

      {/* Play button overlay */}
      <View style={styles.playButton}>
        <Ionicons name="play" size={24} color={Colors[theme].whiteText} />
      </View>

      <View style={styles.content}>
        <View style={styles.captionContainer}>
          <RnText style={styles.captionText} numberOfLines={2}>
            {reel.caption}
          </RnText>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: encodeImagePath(reel.userPhoto) }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <RnText style={styles.userName}>{reel.username}</RnText>
              <RnText style={styles.timeAgo}>
                {formatTimeAgo(reel.createdAt)}
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
            : reel.likes.length) > 0 && (
            <RnText style={styles.actionCount}>
              {optimisticLikes !== undefined
                ? optimisticLikes
                : reel.likes.length}
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
            : reel.dislikes.length) > 0 && (
            <RnText style={styles.actionCount}>
              {optimisticDislikes !== undefined
                ? optimisticDislikes
                : reel.dislikes.length}
            </RnText>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Ionicons
            name="chatbubble-sharp"
            size={24}
            color={Colors[theme].whiteText}
          />
          {reel.comments.length > 0 && (
            <RnText style={styles.actionCount}>{reel.comments.length}</RnText>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    card: {
      width: wp(92),
      height: hp(46),
      borderRadius: Borders.radius3,
      overflow: "hidden",
      marginBottom: hp(2),
      position: "relative",
      flexDirection: "row",
    },
    thumbnailImage: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    playButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -20 }, { translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: wp(6),
      justifyContent: "space-between",
    },
    captionContainer: {
      marginTop: hp(2),
    },
    captionText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.semiBold,
      lineHeight: 22,
      textAlign: "left",
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
      fontSize: FontSize.small,
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

export default ReelCard;
