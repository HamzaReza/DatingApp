import { Colors } from '@/constants/Colors';
import { hp, wp } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CurvedMicInputProps {
  onAttachment?: () => void;
  onVoiceMessage?: () => void;
  onKeyboard?: () => void;
}

const CurvedMicInput: React.FC<CurvedMicInputProps> = ({



  
  onAttachment,
  onVoiceMessage,
  onKeyboard,
}) => {


const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      
      <View style={styles.curvedWrapper}>
        {/* SVG for the curved shape with center cutout */}
        <Svg 
          width={wp(85)} 
          height={hp(8)} 
          viewBox={`0 0 ${wp(85)} ${hp(8)}`}
          style={styles.svgContainer}
        >
          <Path
            d={`
              M 0 ${hp(2)}
              Q 0 0 ${wp(4)} 0
              L ${wp(30)} 0
              Q ${wp(35)} 0 ${wp(38)} ${hp(1.5)}
              Q ${wp(42.5)} ${hp(4)} ${wp(47)} ${hp(1.5)}
              Q ${wp(50)} 0 ${wp(55)} 0
              L ${wp(81)} 0
              Q ${wp(85)} 0 ${wp(85)} ${hp(2)}
              L ${wp(85)} ${hp(6)}
              Q ${wp(85)} ${hp(8)} ${wp(81)} ${hp(8)}
              L ${wp(4)} ${hp(8)}
              Q 0 ${hp(8)} 0 ${hp(6)}
              Z
            `}
            fill={Colors[theme].whiteText}
          />
        </Svg>

        {/* Left Button */}
        <TouchableOpacity style={styles.leftButton} onPress={onAttachment}>
          <Ionicons name="attach" size={24} color={Colors[theme].primary} />
        </TouchableOpacity>

        {/* Right Button */}
        <TouchableOpacity style={styles.rightButton} onPress={onKeyboard}>
          <Ionicons name="apps" size={24} color={Colors[theme].tabIconDefault} />
        </TouchableOpacity>
      </View>

      {/* Floating Mic Button in the Pit */}
      <View style={styles.micContainer}>
        <TouchableOpacity style={styles.micButton} onPress={onVoiceMessage}>
          <Ionicons name="mic" size={28} color={Colors[theme].whiteText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles  = (theme:'dark'|'light')=>StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    height: hp(15),
    justifyContent: 'flex-end',
    width: wp(85),
  },
  ringsContainer: {
    position: 'absolute',
    top: -hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  
  curvedWrapper: {
    position: 'relative',
    width: wp(85),
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  leftButton: {
    position: 'absolute',
    left: wp(6),
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: wp(2),
  },
  rightButton: {
    position: 'absolute',
    right: wp(6),
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: wp(2),
  },
  micContainer: {
    position: 'absolute',
    top: -hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  micButton: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: Colors[theme].pink,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
});

export default CurvedMicInput;