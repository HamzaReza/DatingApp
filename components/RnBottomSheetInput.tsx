import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnBottomSheetInputProps } from "@/types";
import { hp, wp } from "@/utils";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";
import RnText from "./RnText";

const RnBottomSheetInput: React.FC<RnBottomSheetInputProps> = ({
  value,
  maxLength,
  onChangeText,
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
  noError = false,
  multiline,
  numberOfLines,
  editable = true,
  ...props
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
    inputStyle: {
      borderBottomWidth: 1.5,
      borderWidth: 1.5,
      borderColor: Colors[theme].greenText,
      borderRadius: Borders.radius1,
      paddingHorizontal: wp(4),
      height: hp(6.5),
      fontSize: FontSize.small,
    },
  });

  function errorMessage() {
    return <RnText style={[styles.errorText, errorStyle]}>{error}</RnText>;
  }

  return (
    <>
      <BottomSheetTextInput
        maxLength={maxLength}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.inputStyle, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors[theme].placeholderText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        {...props}
      />
      {!noError && errorMessage()}
    </>
  );
};

export default RnBottomSheetInput;
