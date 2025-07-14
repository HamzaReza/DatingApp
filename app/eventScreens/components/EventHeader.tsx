import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type Props = {
  title: string;
  onBackPress: () => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
};

const CustomHeader = ({
  title,
  onBackPress,
  leftIcon = "arrow-back",
  rightIcon,
  onRightPress,
  backgroundColor,
  textColor,
  titleColor,
}: Props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  // Use theme colors if not provided via props
  const bg = backgroundColor ?? Colors[theme].background;
  const txtColor = textColor ?? Colors[theme].pink;
  const ttlColor = titleColor ?? Colors[theme].blackText;

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.iconButton, { backgroundColor: bg }]}
      >
        <Ionicons name={leftIcon as any} size={20} color={txtColor} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: ttlColor }]}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={[styles.iconButton, { backgroundColor: bg }]}
        >
          <Ionicons name={rightIcon as any} size={20} color={txtColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: wp(10) }} />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
  },
  iconButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.circle,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.semiBold,
  },
});
