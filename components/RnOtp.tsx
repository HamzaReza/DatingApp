import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnOtpProps } from "@/types";
import { hp } from "@/utils/Dimensions";
import React, { Fragment } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from "react-native-confirmation-code-field";
import RnText from "./RnText";

const RnOtp = ({
  verifyCode,
  isError,
  cell,
  style,
  value,
  error,
}: RnOtpProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const ref = useBlurOnFulfill({ value, cellCount: cell ?? 4 });

  const styles = StyleSheet.create({
    root: {
      justifyContent: "center",
    },
    cell: {
      width: hp(7),
      height: hp(7),
      lineHeight: Platform.OS === "ios" ? hp(7) : undefined,
      fontSize: FontSize.large,
      fontFamily: FontFamily.semiBold,
      color: Colors[theme].blackText,
      borderWidth: 1,
      borderColor: isError ? Colors[theme].redText : Colors[theme].blackText,
      textAlign: "center",
      textAlignVertical: "center",
      borderRadius: Borders.circle,
    },
    focusCell: {
      borderColor: isError ? Colors[theme].redText : Colors[theme].primary,
      borderWidth: 2,
    },
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.extraSmall,
      textAlign: "center",
      marginTop: hp(1),
    },
  });

  return (
    <View style={[styles.root, style]}>
      <CodeField
        ref={ref}
        value={value}
        onChangeText={(input) => {
          verifyCode(input);
        }}
        keyboardType="number-pad"
        submitBehavior="blurAndSubmit"
        cellCount={cell ?? 4}
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <RnText
              key={`value-${index}`}
              style={[styles.cell, isFocused && styles.focusCell]}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </RnText>
          </Fragment>
        )}
      />
      {isError && <RnText style={styles.errorText}>{error}</RnText>}
    </View>
  );
};

export default RnOtp;
