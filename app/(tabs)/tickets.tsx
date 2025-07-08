import createStyles from "@/app/eventScreens/styles/tickets.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { hp } from "@/utils/Dimensions";
import { router } from "expo-router";
import React from "react";
import { useColorScheme, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const TicketScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <Container>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerTitle}>Tickets</RnText>
        <RoundButton noShadow />
      </View>

      <View style={styles.ticketCardWrapper}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketTopSection}>
            <RnText style={styles.eventTitle}>Ghar By Zakir Khan</RnText>
            <View style={styles.rowWrap}>
              <View>
                <RnText style={styles.label}>Date</RnText>
                <RnText style={styles.value}>13 Mar, 2023</RnText>
              </View>
              <View>
                <RnText style={styles.label}>Time</RnText>
                <RnText style={styles.value}>07:PM</RnText>
              </View>
            </View>
            <View style={styles.rowWrap}>
              <View>
                <RnText style={styles.label}>Venue</RnText>
                <RnText style={styles.value}>13 Mar, 2023</RnText>
              </View>
              <View>
                <RnText style={styles.label}>Seat</RnText>
                <RnText style={styles.value}>05</RnText>
              </View>
            </View>
            <View>
              <RnText style={styles.label}>Genre</RnText>
              <RnText style={styles.value}>Comedy</RnText>
            </View>
          </View>

          {/* QR + Divider Section */}
          <View style={styles.ticketBottomSection}>
            <QRCode
              value="TICKET-12345-EVENT-GHAR-BY-ZAKIR-KHAN"
              size={hp(20)}
              logo={require("@/assets/images/react-logo.png")}
            />
          </View>
        </View>
      </View>

      <RnButton
        title="Download Image"
        style={[styles.downloadBtn, styles.downloadText]}
        icon="download"
        onPress={() => router.dismissAll()}
        noRightIcon
      />
    </Container>
  );
};

export default TicketScreen;
