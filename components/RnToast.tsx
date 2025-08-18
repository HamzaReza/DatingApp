import { RnToastProps } from "@/types";
import Toast from "react-native-toast-message";

export default function showToaster({
  type,
  heading,
  message,
  position,
  onHide,
  onPress,
}: RnToastProps) {
  Toast.show({
    type: type ?? "success",
    text1: heading ?? "Social Dating",
    text2: message,
    position: position ?? "top",
    onHide: onHide,
    onPress: onPress,
  });
}
