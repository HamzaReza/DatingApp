import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RnDropdownProps } from "@/types/Components";
import { hp, wp } from "@/utils";
import React from "react";
import { StyleSheet, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const RnDropdown: React.FC<RnDropdownProps> = ({
  items,
  open,
  dropdownText,
  placeholderStyle,
  emptyText,
  onChangeValue,
  setOpen,
  setItems,
  setValue,
  onOpen,
  value,
  min,
  max,
  zIndex,
  zIndexInverse,
  placeholder,
  style,
  dropDownContainerStyle,
  disabled,
  loading,
  multiple,
}) => {
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
      onOpen={onOpen}
      listMode="SCROLLVIEW"
      mode="BADGE"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      value={value}
      items={items}
      open={open}
      min={min}
      max={max}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      placeholder={placeholder}
      placeholderStyle={[styles.dropdownPlaceholderStyle, placeholderStyle]}
      ListEmptyComponent={() => {
        return <Text style={styles.emptyText}>{emptyText}</Text>;
      }}
      onChangeValue={onChangeValue}
      labelStyle={[styles.dropdownText, dropdownText]}
      style={[styles.style, style]}
      dropDownContainerStyle={[
        styles.dropDownContainerStyle,
        dropDownContainerStyle,
      ]}
      disabled={disabled}
      listItemLabelStyle={[styles.dropdownText, dropdownText]}
      setOpen={setOpen}
      setItems={setItems}
      setValue={setValue}
      loading={loading}
      multiple={multiple}
    />
  );
};

export default RnDropdown;
