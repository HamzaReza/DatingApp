import RnText from "@/components/RnText";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { hp, wp } from "@/utils";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

type CreatorShowProps = {
  showName: string;
  backgroundImage: string;
};

const CreatorShow = ({ showName, backgroundImage }: CreatorShowProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const themedStyles = styles(theme);

  return (
    <View style={themedStyles.imageBackgroundContainer}>
      <ImageBackground
        style={themedStyles.imageBackground}
        imageStyle={themedStyles.imageBackground}
        source={{ uri: backgroundImage }}
      >
        <View style={themedStyles.contentPadding}>
          <RnText style={themedStyles.titleText}>{showName}</RnText>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CreatorShow;

const styles = (theme: "dark" | "light") =>
  StyleSheet.create({
    imageBackgroundContainer: {
      width: wp(37),
      height: hp(24),
      borderRadius: Borders.radius3,
      overflow: "hidden",
      marginRight: wp(5),
    },
    imageBackground: {
      width: wp(37),
      height: hp(24),
      borderRadius: Borders.radius3,
    },
    contentPadding: {
      position: "absolute",
      paddingVertical: hp(1),
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      backgroundColor: Colors[theme].bottomTab,
    },
    titleText: {
      fontFamily: FontFamily.bold,
    },
  });
