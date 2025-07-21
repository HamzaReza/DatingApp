import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnText from "./RnText";
import SvgIcon from "./SvgIcon";

interface InterestTagProps {
  title: string;
  icon?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const InterestTag: React.FC<InterestTagProps> = ({
  title,
  icon,
  isSelected = false,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const isSvgIcon = icon && (icon.includes("<svg") || icon.includes("<path"));

  const renderIcon = () => {
    if (!icon) return null;

    if (isSvgIcon) {
      return (
        <View style={styles.iconContainer}>
          <SvgIcon
            svgString={icon}
            width={16}
            height={16}
            color={
              isSelected ? Colors[theme].background : Colors[theme].redText
            }
          />
        </View>
      );
    }

    return <RnText style={styles.iconText}>{icon}</RnText>;
  };

  return (
    <TouchableOpacity
      style={[styles.tag, isSelected && styles.selectedTag]}
      onPress={onPress}
    >
      {renderIcon()}
      <RnText style={[styles.text, isSelected && styles.selectedText]}>
        {title}
      </RnText>
    </TouchableOpacity>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(3),
      paddingVertical: hp(1),
      borderRadius: Borders.radius4,
      borderWidth: 1,
      borderColor: Colors[theme].greenText,
      marginRight: wp(2),
      marginBottom: hp(1),
    },
    selectedTag: {
      backgroundColor: Colors[theme].redText,
      borderWidth: 0,
    },
    iconContainer: {
      marginRight: wp(1),
      alignItems: "center",
      justifyContent: "center",
    },
    iconText: {
      marginRight: wp(1),
      fontSize: FontSize.regular,
    },
    text: {
      fontSize: FontSize.regular,
      color: Colors[theme].redText,
      fontFamily: FontFamily.semiBold,
      textTransform: "capitalize",
    },
    selectedText: {
      color: Colors[theme].background,
    },
  });
export default InterestTag;
