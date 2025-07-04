import { Colors } from "@/constants/Colors";
import { RnAvatarProps } from "@/types";
import { hp, wp } from "@/utils";
import { Avatar } from "@rneui/base";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";

const RnAvatar: React.FC<RnAvatarProps> = ({
  avatarHeight,
  showAvatarIcon,
  source,
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const createStyles = (theme: "light" | "dark") => {
    const themeStyles = StyleSheet.create({
      avatarIconContainer: {
        backgroundColor: Colors[theme].tabIconDefault,
      },
      avatar: {
        height: hp(20),
        backgroundColor: Colors[theme].primary,
      },
      accessoryStyle: {
        bottom: hp(1),
        right: wp(3),
      },
    });
    return themeStyles;
  };

  const styles = createStyles(theme);
  return showAvatarIcon ? (
    <Avatar
      size={avatarHeight ?? styles.avatar.height}
      icon={{ name: "user", type: "font-awesome" }}
      containerStyle={[styles.avatarIconContainer, style]}
      rounded
    />
  ) : (
    <Avatar
      size={avatarHeight ?? styles.avatar.height}
      containerStyle={style}
      rounded
      source={{
        uri: source,
      }}
    />
  );
};

export default RnAvatar;
