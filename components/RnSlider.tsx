import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnSliderProps } from "@/types/Components";
import { Slider } from "@rneui/base";
import React from "react";

const RnSlider: React.FC<RnSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  style,
  thumbColor,
  trackColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbStyle,
  trackStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const defaultThumbColor = thumbColor || Colors[theme].redText;
  const defaultTrackColor = trackColor || Colors[theme].redText + "33";
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      allowTouchTrack
      trackStyle={
        trackStyle || { height: 4, backgroundColor: defaultTrackColor }
      }
      thumbStyle={
        thumbStyle || {
          height: 24,
          width: 24,
          backgroundColor: defaultThumbColor,
        }
      }
      style={style}
      minimumTrackTintColor={minimumTrackTintColor || defaultThumbColor}
      maximumTrackTintColor={maximumTrackTintColor || defaultTrackColor}
    />
  );
};

export default RnSlider;
