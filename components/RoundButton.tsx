import { Colors } from "@/constants/Colors";
import { wp } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
  View,
} from "react-native";

interface RoundButtonProps extends TouchableOpacityProps {
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
  backgroundColour?: string;
  showDot?: boolean;
  noShadow?: boolean;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  iconName,
  iconColor,
  iconSize = wp(5),
  style,
  onPress,
  backgroundColour,
  showDot = false,
  noShadow = false,
  ...touchableProps
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const iconClr = iconColor ?? Colors[theme].greenText;
  const bgClr = backgroundColour ?? "transparent";

  const styles = StyleSheet.create({
    container: {
      padding: wp(1.5),
      borderRadius: wp(6),
      backgroundColor: "rgba(255,255,255,0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    notificationDot: {
      position: "absolute",
      top: wp(1),
      right: wp(1),
      width: wp(2),
      height: wp(2),
      borderRadius: wp(1),
      backgroundColor: Colors[theme].redText,
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bgClr },
        style,
        !noShadow && styles.shadow,
      ]}
      onPress={onPress}
      {...touchableProps}
    >
      <MaterialIcons name={iconName} color={iconClr} size={iconSize} />
      {showDot && <View style={styles.notificationDot} />}
    </TouchableOpacity>
  );
};

export default RoundButton;
