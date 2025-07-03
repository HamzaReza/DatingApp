import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import RnText from "./RnText";

type MaterialIconsName = React.ComponentProps<typeof MaterialIcons>["name"];

interface PrimaryHeaderProps {
  title?: string;
  leftIconName?: MaterialIconsName;
  rightIconName?: MaterialIconsName;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIconColor?: string;
  rightIconColor?: string;
  titleColor?: string;
  leftIconSize?: number;
  rightIconSize?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  borderWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
  title = "",
  leftIconName = "chevron-left",
  rightIconName = "more-vert",
  onLeftPress = () => {},
  onRightPress = () => {},
  leftIconColor,
  rightIconColor,
  titleColor,
  leftIconSize = 24,
  rightIconSize = 24,
  showLeftIcon = true,
  showRightIcon = true,
  borderWidth = 0.5,
  backgroundColor,
  borderColor,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  // Use theme colors if not provided via props
  const leftIconClr = leftIconColor ?? Colors[theme].redText;
  const rightIconClr = rightIconColor ?? Colors[theme].redText;
  const ttlColor = titleColor ?? Colors[theme].greenText;
  const bgColor = backgroundColor ?? Colors[theme].background;
  const brdColor = borderColor ?? Colors[theme].primary;

  return (
    <View style={styles.header}>
      {showLeftIcon && (
        <TouchableOpacity
          onPress={onLeftPress}
          style={{
            borderColor: brdColor,
            borderWidth: borderWidth,
            width: wp(9),
            height: wp(9),
            borderRadius: Borders.circle,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
          }}
        >
          <MaterialIcons
            name={leftIconName}
            size={leftIconSize}
            color={leftIconClr}
          />
        </TouchableOpacity>
      )}

      <RnText style={[styles.title, { color: ttlColor }]}>{title}</RnText>

      {showRightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            borderColor: brdColor,
            borderWidth: 0.5,
            width: wp(9),
            height: wp(9),
            borderRadius: Borders.circle,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
          }}
        >
          <MaterialIcons
            name={rightIconName}
            size={rightIconSize}
            color={rightIconClr}
          />
        </TouchableOpacity>
      ) : (
        <Pressable
          onPress={onRightPress}
          style={{
            width: wp(9),
            height: wp(9),
          }}
        ></Pressable>
      )}
    </View>
  );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(2),
  },
  title: {
    fontSize: FontSize.extraLarge,
    fontWeight: "bold",
  },
  round: {
    // Your round style properties here
  },
});
