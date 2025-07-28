import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { ReelComment } from "@/firebase/reels";
import { hp, wp } from "@/utils";
import { formatTimeAgo } from "@/utils/FormatDate";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnInput from "./RnInput";
import RnModal from "./RnModal";
import RnText from "./RnText";

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: ReelComment[];
  onAddComment: (comment: string) => Promise<void>;
  loading?: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  onAddComment,
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting || loading) return;

    const commentText = newComment.trim();
    setIsSubmitting(true);
    try {
      await onAddComment(commentText);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: ReelComment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <RnText style={styles.avatarText}>
                {item.username.charAt(0).toUpperCase()}
              </RnText>
            </View>
          </View>
          <View style={styles.commentMeta}>
            <RnText style={styles.username}>{item.username}</RnText>
            <RnText style={styles.timestamp}>
              {formatTimeAgo(item.createdAt)}
            </RnText>
          </View>
        </View>
      </View>
      <View style={styles.commentContent}>
        <RnText style={styles.commentText}>{item.content}</RnText>
      </View>
    </View>
  );

  return (
    <RnModal show={visible} backDrop={onClose} backButton={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <RnText style={styles.title}>Comments ({comments.length})</RnText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors[theme].blackText} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubble-outline"
                size={48}
                color={Colors[theme].tabIconDefault}
              />
              <RnText style={styles.emptyText}>No comments yet</RnText>
              <RnText style={styles.emptySubtext}>
                Be the first to share your thoughts!
              </RnText>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <RnInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            multiline
            maxLength={100}
            containerStyle={styles.inputContainerStyle}
            noError
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting || loading}
          >
            <MaterialIcons
              name={isSubmitting || loading ? "hourglass-empty" : "send"}
              size={20}
              color={Colors[theme].pink}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </RnModal>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      maxHeight: hp(80),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].gray,
    },
    title: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].blackText,
    },
    closeButton: {
      padding: wp(2),
    },
    commentsList: {
      flex: 1,
      paddingHorizontal: wp(4),
    },
    commentItem: {
      paddingVertical: hp(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].gray,
    },
    commentHeader: {
      marginBottom: hp(1),
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarContainer: {
      marginRight: wp(3),
    },
    avatar: {
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      backgroundColor: Colors[theme].primary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
    },
    commentMeta: {
      flex: 1,
    },
    username: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].blackText,
      marginBottom: hp(0.5),
    },
    timestamp: {
      fontSize: FontSize.extraSmall,
      color: Colors[theme].tabIconDefault,
    },
    commentContent: {
      marginLeft: wp(13),
    },
    commentText: {
      fontSize: FontSize.regular,
      color: Colors[theme].blackText,
      lineHeight: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: hp(10),
    },
    emptyText: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].tabIconDefault,
      marginTop: hp(2),
    },
    emptySubtext: {
      fontSize: FontSize.small,
      color: Colors[theme].tabIconDefault,
      marginTop: hp(1),
      textAlign: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      borderTopWidth: 1,
      borderTopColor: Colors[theme].gray,
    },
    commentInput: {
      flex: 1,
      marginRight: wp(2),
    },
    inputContainerStyle: {
      width: wp(70),
      marginRight: wp(2),
    },
    postButton: {
      width: wp(20),
    },
    sendButton: {
      width: wp(12),
      height: wp(12),
      borderRadius: Borders.radius2,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors[theme].gray,
    },
  });

export default CommentModal;
