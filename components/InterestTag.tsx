import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import RnText from "./RnText";

interface InterestTagProps {
  title: string;
  icon?: String;
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
      
      <RnText style={[styles.text, isSelected && styles.selectedText]}>
       {icon} {title}
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
    borderRadius: Borders.radius4,
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
    fontFamily:FontFamily.semiBold,
  },
  selectedText: {
    color: Colors[theme].background,
  },
});
export default InterestTag;
