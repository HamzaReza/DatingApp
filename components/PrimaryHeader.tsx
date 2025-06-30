import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import RnText from "./RnText";

type SimpleLineIconsName = React.ComponentProps<typeof SimpleLineIcons>["name"];

interface PrimaryHeaderProps {
  title?: string;
  leftIconName?: SimpleLineIconsName;
  rightIconName?: SimpleLineIconsName;
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
  backgroundColor?:string
  borderColor?:string
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
  title = "",
  leftIconName = "arrow-left",
  rightIconName = "options",
  onLeftPress = () => {},
  onRightPress = () => {},
  leftIconColor = Colors.light.redText,
  rightIconColor = Colors.light.redText,
  titleColor = Colors.light.greenText,
  leftIconSize = 24,
  rightIconSize = 24,
  showLeftIcon = true,
  showRightIcon = true,
  borderWidth = 0.5,
  backgroundColor='',
  borderColor=rightIconColor
}) => {
  return (
    <View style={styles.header}>
      {showLeftIcon && (
        <TouchableOpacity
          onPress={onLeftPress}
          style={{
            borderColor: borderColor,
            borderWidth: borderWidth,
            width: wp(9),
            height: wp(9),
            borderRadius: Borders.circle,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:backgroundColor
            
          }}
        >
          <SimpleLineIcons
            name={leftIconName}
            size={leftIconSize}
            color={leftIconColor}
          />
        </TouchableOpacity>
      )}

      <RnText style={[styles.title, { color: titleColor }]}>{title}</RnText>

      {showRightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            borderColor: borderColor,
            borderWidth: 0.5,
            width: wp(9),
            height: wp(9),
            borderRadius: Borders.circle,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:backgroundColor
          }}
        >
          <SimpleLineIcons
            name={rightIconName}
            size={rightIconSize}
            color={rightIconColor}
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
