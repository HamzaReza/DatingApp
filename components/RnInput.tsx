import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnInputProps } from "@/types";
import { hp, wp } from "@/utils";
import { Input } from "@rneui/themed";
import React from "react";
import { StyleSheet } from "react-native";
import RnText from "./RnText";

const RnInput: React.FC<RnInputProps> = ({
  value,
  maxLength,
  onChangeText,
  onChange,
  onBlur,
  onFocus,
  keyboardType,
  error,
  errorStyle,
  secureTextEntry,
  style,
  containerStyle,
  inputContainerStyle,
  placeholder,
  leftIcon,
  rightIcon,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.extraSmall,
      marginBottom: hp(2),
      marginLeft: wp(1),
    },
    style: {
      fontSize: FontSize.small,
    },
    containerStyle: {},
    inputContainerStyle: {
      borderBottomWidth: 1.5,
      borderWidth: 1.5,
      borderColor: Colors[theme].greenText,
      borderRadius: Borders.radius1,
      paddingHorizontal: wp(4),
      height: hp(6.5),
    },
  });

  function errorMessage() {
    return <RnText style={[styles.errorText, errorStyle]}>{error}</RnText>;
  }

  return (
    <Input
      maxLength={maxLength}
      onChangeText={onChangeText}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      value={value}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      ErrorComponent={errorMessage}
      renderErrorMessage={Boolean(error)}
      allowFontScaling={false}
      style={[styles.style, style]}
      containerStyle={[styles.containerStyle, containerStyle]}
      inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle]}
      placeholder={placeholder}
      placeholderTextColor={Colors[theme].placeholderText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    />
  );
};

export default RnInput;
