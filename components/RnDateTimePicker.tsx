import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnDateTimePickerProps } from "@/types";
import { hp, wp } from "@/utils";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import RnText from "./RnText";

const RnDateTimePicker: React.FC<RnDateTimePickerProps> = ({
  value,
  onChange,
  mode = "date",
  display = "default",
  placeholder = "Select date/time",
  label,
  error,
  errorStyle,
  style,
  containerStyle,
  minimumDate,
  maximumDate,
  minuteInterval,
  timeZoneOffsetInMinutes,
  timeZoneName,
  textColor,
  accentColor,
  neutralButtonLabel,
  positiveButtonLabel,
  negativeButtonLabel,
  is24Hour = true,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const [showPicker, setShowPicker] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: hp(2),
    },
    label: {
      fontSize: FontSize.small,
      color: Colors[theme].blackText,
      marginBottom: hp(1),
      fontFamily: FontFamily.regular,
    },
    inputContainer: {
      borderWidth: 1.5,
      borderColor: error ? Colors[theme].redText : Colors[theme].primary,
      borderRadius: Borders.radius1,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      backgroundColor: Colors[theme].background,
      minHeight: hp(6),
      justifyContent: "center",
    },
    inputText: {
      fontSize: FontSize.small,
      color: value ? Colors[theme].blackText : Colors[theme].placeholderText,
    },
    errorText: {
      color: Colors[theme].redText,
      fontSize: FontSize.regular,
      marginTop: hp(0.5),
    },
    disabledContainer: {
      opacity: 0.6,
    },
  });

  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS === "ios") {
        setShowPicker(true);
      } else {
        setShowPicker(true);
      }
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      onChange(event, selectedDate);
    }
  };

  const formatDate = (date: Date, mode: string) => {
    if (mode === "date") {
      return date.toLocaleDateString();
    } else if (mode === "time") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !is24Hour,
      });
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !is24Hour,
      })}`;
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    return formatDate(value, mode);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <RnText style={styles.label}>{label}</RnText>}

      <TouchableOpacity
        style={[
          styles.inputContainer,
          disabled && styles.disabledContainer,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <RnText style={styles.inputText}>{getDisplayValue()}</RnText>
      </TouchableOpacity>

      {error && <RnText style={[styles.errorText, errorStyle]}>{error}</RnText>}

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          minuteInterval={minuteInterval}
          timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
          timeZoneName={timeZoneName}
          textColor={textColor || Colors[theme].blackText}
          accentColor={accentColor || Colors[theme].pink}
          neutralButtonLabel={neutralButtonLabel}
          positiveButtonLabel={positiveButtonLabel}
          negativeButtonLabel={negativeButtonLabel}
          is24Hour={is24Hour}
        />
      )}
    </View>
  );
};

export default RnDateTimePicker;
