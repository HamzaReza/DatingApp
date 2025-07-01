import createStyles from '@/app/tabStyles/connections.styles';
import CurvedMicInput from "@/components/CurvedMicInputProps";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { wp } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function Connection() {
  const { id } = useLocalSearchParams();


  const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? "dark" : "light";
    const styles = createStyles(theme);

  const handleBackPress = () => {
    router.back();
  };

  const handleGetReadReceipts = () => {
    console.log("Get read receipts");
  };

  const handleAttachment = () => {
    console.log("Add attachment");
  };

  const handleVoiceMessage = () => {
    console.log("Record voice message");
  };

  const handleKeyboard = () => {
    console.log("Open keyboard");
  };

  return (
    <Container customStyle={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <RoundButton
          iconName="arrow-back-ios-new"
          iconColor={Colors[theme].whiteText}
          iconSize={wp(5)}
          borderColor={Colors[theme].gray}
          onPress={handleBackPress}
        />
      </View>

      {/* Connection Content */}
      <View style={styles.content}>
        <RnText style={styles.connectionText}>
          You connected with <RnText style={styles.nameText}>Clara</RnText>
        </RnText>
        <RnText style={styles.timeText}>11 mins ago</RnText>

        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=300",
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileBorder} />
          </View>
        </View>

        <RnText style={styles.readReceiptTitle}>
          Know when{" "}
          <RnText
            style={[styles.readReceiptTitle, { color: Colors[theme].pink }]}
          >
            Clara
          </RnText>{" "}
          has read your message
        </RnText>

        <TouchableOpacity
          style={styles.readReceiptButton}
          onPress={handleGetReadReceipts}
        >
          <Ionicons
            name="checkmark-done-sharp"
            size={16}
            color={Colors[theme].whiteText}
          />
          <RnText style={styles.readReceiptButtonText}>
            Get Read Receipts
          </RnText>
        </TouchableOpacity>
      </View>

      {/* Bottom Input */}
      <View style={styles.bottomContainer}>
        <ImageBackground
          source={require("@/assets/images/rings.png")}
          style={styles.decorativeCircles}
        />
        <CurvedMicInput
          onVoiceMessage={handleVoiceMessage}
          onAttachment={handleAttachment}
          onKeyboard={handleKeyboard}
        />
      </View>
    </Container>
  );
}

