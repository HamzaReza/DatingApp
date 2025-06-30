import { Colors } from '@/constants/Colors';
import { wp } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface RoundButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof MaterialIcons.glyphMap; // valid icon names from MaterialIcons
  iconColor?: string;
  iconSize?: number;
  borderColor?: string;
  onPress?: () => void;
  backgroundColour?: string; // optional background color
}

const RoundButton: React.FC<RoundButtonProps> = ({
  iconName,
  iconColor = Colors.light.greenText,
  iconSize = wp(5),
  borderColor = Colors.light.greenText,
  style,
  onPress,
  backgroundColour='transparent',
  ...touchableProps
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor, backgroundColor: backgroundColour }, style]}
      onPress={onPress}
      {...touchableProps}
    >
      <MaterialIcons name={iconName} color={iconColor} size={iconSize} />
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
    