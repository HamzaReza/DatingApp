import { Colors } from '@/constants/Colors';
import { wp } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, useColorScheme } from 'react-native';

interface RoundButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  borderColor?: string;
  onPress?: () => void;
  backgroundColour?: string;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  iconName,
  iconColor,
  iconSize = wp(5),
  borderColor,
  style,
  onPress,
  backgroundColour,
  ...touchableProps
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const iconClr = iconColor ?? Colors[theme].greenText;
  const borderClr = borderColor ?? Colors[theme].greenText;
  const bgClr = backgroundColour ?? 'transparent';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: borderClr, backgroundColor: bgClr },
        style,
      ]}
      onPress={onPress}
      {...touchableProps}
    >
      <MaterialIcons name={iconName} color={iconClr} size={iconSize} />
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: wp(2),
    borderRadius: wp(6),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(11),
    height: wp(11),
  },
});