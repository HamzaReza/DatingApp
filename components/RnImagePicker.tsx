import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { ListItemType, RnImagePickerProps } from "@/types";
import { hp, wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { ListItem } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RnModal from "./RnModal";

const RnImagePicker: React.FC<RnImagePickerProps> = ({
  setUri,
  visible,
  showPicker,
  hidePicker,
  multiple = false,
  children,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const handleImagePick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("You need to allow access to your photos to upload an image");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: multiple ? ["images", "videos"] : "images",
        allowsMultipleSelection: multiple,
        allowsEditing: multiple ? false : true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (multiple) {
          const images = result.assets.map(asset => ({
            uri: asset.uri,
            path: asset.uri,
            type: `image/${asset.uri.split(".").pop()}`,
            name: asset.uri.split("/").pop() || "",
          }));
          setUri(images);
        } else {
          const image = result.assets[0];
          setUri({
            uri: image.uri,
            path: image.uri,
            type: `image/${image.uri.split(".").pop()}`,
            name: image.uri.split("/").pop() || "",
          });
        }
        hidePicker();
      }
    } catch (error) {
      console.error(error);
      alert("Error picking image");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("You need to allow access to your camera to take a photo");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        setUri({
          uri: image.uri,
          path: image.uri,
          type: `image/${image.uri.split(".").pop()}`,
          name: image.uri.split("/").pop() || "",
        });
        hidePicker();
      }
    } catch (error) {
      console.error(error);
      alert("Error taking photo");
    }
  };

  const list: ListItemType[] = [
    {
      title: "Open Camera for Image",
      icon: "camera",
      onPress: handleTakePhoto,
    },
    {
      title: "Choose Gallery",
      icon: "image",
      onPress: handleImagePick,
    },
    {
      title: "Cancel",
      icon: "xmark",
      onPress: () => hidePicker(),
    },
  ];

  const createStyles = (theme: "light" | "dark") => {
    const themeStyles = StyleSheet.create({
      containerStyle: {
        backgroundColor: Colors[theme].background,
        borderRadius: Borders.radius3,
        marginVertical: hp(0.5),
      },
      contentStyle: {
        flexDirection: "row",
        alignItems: "center",
      },
      titleStyle: {
        marginLeft: wp(5),
      },
      icon: {
        color: Colors[theme].blackText,
        height: hp(2.5),
      },
    });
    return themeStyles;
  };

  const styles = createStyles(theme);

  return (
    <>
      <TouchableOpacity onPress={showPicker}>{children}</TouchableOpacity>
      <RnModal show={visible} backDrop={hidePicker} backButton={hidePicker}>
        <View style={styles.containerStyle}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              onPress={l.onPress}
              containerStyle={styles.containerStyle}
            >
              <ListItem.Content style={styles.contentStyle}>
                <FontAwesome6
                  name={l.icon}
                  color={styles.icon.color}
                  size={styles.icon.height}
                />
                <ListItem.Title
                  style={styles.titleStyle}
                  allowFontScaling={false}
                >
                  {l.title}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </RnModal>
    </>
  );
};

export default RnImagePicker;
