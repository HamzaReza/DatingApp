import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnPhoneInputProps } from "@/types";
import { hp, wp } from "@/utils";
import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import RnText from "./RnText";

const RnPhoneInput = forwardRef<any, RnPhoneInputProps>(
  ({ value, onChangeText, error, errorStyle }, ref) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? "dark" : "light";

    const styles = StyleSheet.create({
      containerStyle: {
        borderBottomWidth: 1.5,
        borderWidth: 1.5,
        borderColor: Colors[theme].greenText,
        borderRadius: Borders.radius1,
        height: hp(6.5),
        width: wp(92),
      },
      flagButtonStyle: {
        width: wp(20),
      },
      textContainerStyle: {
        borderRadius: Borders.radius1,
        paddingVertical: 0,
      },
      textInputStyle: {
        fontSize: FontSize.small,
      },
      errorText: {
        color: Colors[theme].redText,
        fontSize: FontSize.extraSmall,
        marginLeft: wp(1),
      },
    });

    return (
      <>
        <PhoneInput
          ref={ref}
          defaultValue={value}
          defaultCode={__DEV__ ? "PK" : "GB"}
          layout="second"
          onChangeText={onChangeText}
          onChangeFormattedText={onChangeText}
          containerStyle={styles.containerStyle}
          textContainerStyle={styles.textContainerStyle}
          flagButtonStyle={styles.flagButtonStyle}
          textInputStyle={styles.textInputStyle}
          codeTextStyle={styles.textInputStyle}
          textInputProps={{
            placeholderTextColor: Colors[theme].placeholderText,
          }}
        />
        <RnText style={[styles.errorText, errorStyle]}>{error}</RnText>
      </>
    );
  }
);

RnPhoneInput.displayName = "RnPhoneInput";

export default RnPhoneInput;
