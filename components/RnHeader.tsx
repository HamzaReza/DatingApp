import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnHeaderProps } from "@/types";
import { wp } from "@/utils";
import { Header } from "@rneui/base";
import React from "react";
import { StyleSheet } from "react-native";
import RnText from "./RnText";

const RnHeader: React.FC<RnHeaderProps> = ({
  statusbar,
  barStyle,
  centerComponent,
  leftComponent,
  rightComponent,
  centerText,
  backgroundColor,
  containerStyle,
  centerContainerStyle,
  leftContainerStyle,
  rightContainerStyle,
  centerTextStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const styles = StyleSheet.create({
    statusbar: {
      backgroundColor: Colors[theme].background,
    },
    sideContainerStyle: {
      marginHorizontal: wp(4),
      justifyContent: "center",
    },
    centerTextStyle: {
      color: Colors[theme].blackText,
      fontSize: FontSize.large,
    },
  });

  return (
    <Header
      statusBarProps={statusbar ?? styles.statusbar}
      barStyle={barStyle ?? "light-content"}
      leftComponent={leftComponent}
      centerComponent={
        centerText ? (
          <RnText style={[styles.centerTextStyle, centerTextStyle]}>
            {centerText}
          </RnText>
        ) : (
          centerComponent
        )
      }
      rightComponent={rightComponent}
      backgroundColor={backgroundColor ?? styles.statusbar.backgroundColor}
      containerStyle={containerStyle}
      centerContainerStyle={centerContainerStyle}
      leftContainerStyle={[styles.sideContainerStyle, leftContainerStyle]}
      rightContainerStyle={[styles.sideContainerStyle, rightContainerStyle]}
    />
  );
};

export default RnHeader;
