import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnTextProps } from "@/types";
import React from "react";
import { StyleSheet, Text } from "react-native";

const RnText: React.FC<RnTextProps> = ({
  onPress,
  style,
  numberOfLines,
  selectable,
  children,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    textStyle: {
      color: Colors[theme].blackText,
      fontSize: FontSize.regular,
      fontFamily: FontFamily.regular,
    },
  });

  return (
    <Text
      onPress={onPress}
      style={[styles.textStyle, style]}
      numberOfLines={numberOfLines ?? 0}
      allowFontScaling={false}
      selectable={selectable ?? false}
    >
      {children}
    </Text>
  );
};

export default React.memo(RnText);
