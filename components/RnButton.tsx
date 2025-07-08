import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnButtonProps } from "@/types";
import { hp, wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./RnText";

const RnButton: React.FC<RnButtonProps> = ({
  loading,
  disabled,
  style,
  onPress,
  hitSlop,
  title,
  loaderColor,
  children,
  icon,
  noRightIcon,
  rightIconColor,
  leftIconColor,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    whiteColor: {
      color: Colors[theme].whiteText,
    },
    buttonContainer: {
      height: hp(6.5),
      width: wp(92),
      backgroundColor: Colors[theme].button,
      borderRadius: Borders.circle,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    iconContainer: {
      alignItems: "flex-start",
      paddingHorizontal: wp(4),
    },
    leftIconContainer: {
      backgroundColor: Colors[theme].background,
      width: wp(10),
      height: wp(10),
      borderRadius: Borders.circle,
      alignItems: "center",
      justifyContent: "center",
    },
    disabledButton: {
      backgroundColor: "gray",
    },
    whiteText: {
      color: Colors[theme].whiteText,
      fontSize: FontSize.medium,
      fontFamily: FontFamily.semiBold,
    },
    iconText: {
      flex: 1,
      textAlign: "center",
    },
    icon: {
      fontSize: FontSize.medium,
      color: Colors[theme].button,
      marginLeft: wp(4),
    },
    rowView: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <>
      {!loading ? (
        !disabled ? (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              style[0],
              icon && styles.iconContainer,
            ]}
            onPress={onPress}
            hitSlop={hitSlop}
          >
            <View style={styles.rowView}>
              {icon ? (
                <>
                  <View style={styles.leftIconContainer}>
                    <FontAwesome6
                      name={icon}
                      color={leftIconColor ?? styles.icon.color}
                      size={styles.icon.fontSize}
                    />
                  </View>
                  <Text
                    style={[
                      styles.whiteText,
                      style[1],
                      icon && styles.iconText,
                    ]}
                  >
                    {title}
                  </Text>
                  {!noRightIcon && (
                    <FontAwesome6
                      solid
                      name="caret-right"
                      size={styles.icon.fontSize}
                      color={rightIconColor ?? styles.icon.color}
                      style={{ marginLeft: styles.icon.marginLeft }}
                    />
                  )}
                </>
              ) : (
                <Text style={[styles.whiteText, style[1]]}>{title}</Text>
              )}
            </View>
            {children && children}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={[
              styles.buttonContainer,
              style[0],
              styles.disabledButton,
              icon && styles.iconContainer,
            ]}
          >
            <View style={styles.rowView}>
              {icon ? (
                <>
                  <View style={styles.leftIconContainer}>
                    <FontAwesome6
                      name={icon}
                      color={leftIconColor ?? styles.icon.color}
                      size={styles.icon.fontSize}
                    />
                  </View>
                  <Text
                    style={[
                      styles.whiteText,
                      style[1],
                      icon && styles.iconText,
                    ]}
                  >
                    {title}
                  </Text>
                  {!noRightIcon && (
                    <FontAwesome6
                      solid
                      name="caret-right"
                      size={styles.icon.fontSize}
                      color={styles.icon.color}
                      style={{ marginLeft: styles.icon.marginLeft }}
                    />
                  )}
                </>
              ) : (
                <Text style={[styles.whiteText, style[1]]}>{title}</Text>
              )}
            </View>
            {children && children}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          disabled
          style={[styles.buttonContainer, style[0]]}
          onPress={onPress}
        >
          <ActivityIndicator color={loaderColor || styles.whiteColor.color} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default RnButton;
