import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnDropdownProps } from "@/types/Components";
import { hp, wp } from "@/utils";
import React from "react";
import { StyleSheet, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const RnDropdown: React.FC<RnDropdownProps> = (props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const createStyles = (theme: "light" | "dark") => {
    const themeStyles = StyleSheet.create({
      dropdownPlaceholderStyle: {
        fontSize: FontSize.small,
        color: Colors[theme].placeholderText,
      },
      style: {
        backgroundColor: Colors[theme].background,
        borderColor: Colors[theme].greenText,
        borderRadius: Borders.radius1,
        borderWidth: 1.5,
        borderBottomWidth: 1.5,
        paddingHorizontal: wp(4),
        height: hp(6.5),
        fontSize: FontSize.small,
      },
      dropDownContainerStyle: {
        backgroundColor: Colors[theme].background,
        borderColor: Colors[theme].greenText,
        borderRadius: Borders.radius1,
      },
      dropdownText: {
        color: Colors[theme].blackText,
        fontSize: FontSize.small,
      },
      emptyText: {
        textAlign: "center",
        paddingVertical: hp(1.5),
        color: Colors[theme].blackText,
        fontSize: FontSize.small,
      },
    });
    return themeStyles;
  };
  const styles = createStyles(theme);

  return (
    <DropDownPicker
      onOpen={props.onOpen}
      listMode="SCROLLVIEW"
      mode="BADGE"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      value={props.value}
      items={props.items}
      open={props.open}
      multiple={props.multiple}
      min={props.min}
      max={props.max}
      zIndex={props.zIndex}
      zIndexInverse={props.zIndexInverse}
      placeholder={props.placeholder}
      placeholderStyle={[
        styles.dropdownPlaceholderStyle,
        props.placeholderStyle,
      ]}
      ListEmptyComponent={() => {
        return <Text style={styles.emptyText}>{props.emptyText}</Text>;
      }}
      onChangeValue={props.onChangeValue}
      labelStyle={styles.dropdownText}
      style={[styles.style, props.style]}
      dropDownContainerStyle={[
        styles.dropDownContainerStyle,
        props.dropDownContainerStyle,
      ]}
      disabled={props.disabled}
      listItemLabelStyle={styles.dropdownText}
      setOpen={props.setOpen}
      setItems={props.setItems}
      setValue={props.setValue}
      loading={props.loading}
    />
  );
};

export default RnDropdown;
