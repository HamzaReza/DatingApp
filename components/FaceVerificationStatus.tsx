import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { FontSize } from "@/constants/FontSize";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import RnText from "./RnText";
import showToaster from "./RnToast";

interface FaceVerificationStatusProps {
  status: "failed" | "idle" | "verifying" | "verified";
}

const FaceVerificationStatus: React.FC<FaceVerificationStatusProps> = ({
  status,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  useEffect(() => {
    if (status === "failed") {
      showToaster({
        type: "error",
        heading: "Face Verification Failed",
        message: "The face does not match your profile picture.",
        position: "top",
      });
    }
  }, [status]);

  return (
    <View style={styles.statusRow}>
      <RnText style={styles.statusText}>Verifying face match... </RnText>
    </View>
  );
};

const createStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusText: {
      fontSize: FontSize.large,
      fontFamily: FontFamily.medium,
      color: Colors[theme].greenText,
    },
  });

export default FaceVerificationStatus;
