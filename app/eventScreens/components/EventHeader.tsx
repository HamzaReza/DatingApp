import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  onBackPress: () => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  titleColor?:string
};

const CustomHeader = ({
  title,
  onBackPress,
  leftIcon = 'arrow-back',
  rightIcon,
  onRightPress,
  backgroundColor = 'white',
  textColor = Colors.light.pink,
  titleColor=Colors.light.blackText
}: Props) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.iconButton, { backgroundColor }]}
      >
        <Ionicons name={leftIcon as any} size={20} color={textColor} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={[styles.iconButton, { backgroundColor }]}
        >
          <Ionicons name={rightIcon as any} size={20} color={textColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: wp(10) }} />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
   
  },
  iconButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: Borders.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: '700',
  },
});
