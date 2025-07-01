import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import RnText from "./RnText";

interface InterestTagProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
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


  return (
    <TouchableOpacity
      style={[styles.tag, isSelected && styles.selectedTag]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={isSelected ? Colors[theme].background : Colors[theme].redText}
          style={styles.icon}
        />
      )}
      <RnText style={[styles.text, isSelected && styles.selectedText]}>
        {title}
      </RnText>
    </TouchableOpacity>
  );
};

const createStyles  = (theme:'dark'|'light')=>StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors[theme].greenText,
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  selectedTag: {
    backgroundColor: Colors[theme].redText,
  },
  icon: {
    marginRight: wp(1),
  },
  text: {
    fontSize: FontSize.regular,
    color: Colors[theme].redText,
    fontWeight: "600",
  },
  selectedText: {
    color: Colors[theme].background,
  },
});
export default InterestTag;
