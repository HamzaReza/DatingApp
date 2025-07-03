import createStyles from "@/app/eventScreens/styles/ticketDetails.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";

const TicketDetails = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const [selected, setSelected] = useState<"Vip" | "Economy">("Vip");
  const [seatCount, setSeatCount] = useState(1);
  const [ticketPrice] = useState(500);

  const handleDecrease = useCallback(() => {
    if (seatCount > 1) setSeatCount(seatCount - 1);
  }, [seatCount]);

  const handleIncrease = useCallback(
    () => setSeatCount(seatCount + 1),
    [seatCount]
  );

  return (
    <Container>
      <View style={styles.headerContainer}>
        <RoundButton
          iconName="chevron-left"
          iconSize={22}
          iconColor={Colors[theme].primary}
          borderColor={Colors[theme].background}
          backgroundColour={Colors[theme].whiteText}
          onPress={() => router.back()}
        />
        <RnText style={styles.headerText}>Ticket Details</RnText>
        <RoundButton noShadow />
      </View>
      <RnText style={styles.ticketTypeHeader}>Ticket Type</RnText>

      <View style={styles.tabContainer}>
        <RnButton
          title="VIP"
          onPress={() => setSelected("Vip")}
          style={[
            [
              styles.tabButton,
              styles.vipButton,
              selected === "Vip" && styles.tabButtonActive,
            ],
            styles.tabText,
          ]}
        />
        <RnButton
          title="Economy"
          style={[
            [
              styles.tabButton,
              styles.economyButton,
              selected === "Economy" && styles.tabButtonActive,
            ],
            styles.tabText,
          ]}
          onPress={() => setSelected("Economy")}
        />
      </View>

      <RnText style={styles.ticketTypeHeader}>Seat</RnText>

      <View style={styles.seatSelectorContainer}>
        <View style={styles.seatSelectorControls}>
          <TouchableOpacity
            style={styles.seatButton}
            onPress={handleDecrease}
            disabled={seatCount === 1}
          >
            <RnText style={styles.seatButtonText}>-</RnText>
          </TouchableOpacity>
          <RnText style={styles.seatCount}>{seatCount}</RnText>
          <TouchableOpacity style={styles.seatButton} onPress={handleIncrease}>
            <RnText style={styles.seatButtonText}>+</RnText>
          </TouchableOpacity>
        </View>
      </View>

      <RnText style={styles.ticketTypeHeader}>Ticket Price</RnText>
      <View style={styles.singlePriceContainer}>
        <RnText>{selected} Ticket</RnText>
        <RnText>${ticketPrice}</RnText>
      </View>
      <RnText style={styles.mutiplyText}>
        {seatCount} X $ {ticketPrice}
      </RnText>

      <View style={styles.horizontaLine}></View>
      <View style={styles.singlePriceContainer}>
        <RnText style={styles.totalPrice}>Total Price</RnText>
        <RnText style={styles.totalPrice}>${seatCount * ticketPrice}</RnText>
      </View>
      <RnButton
        title="Continue"
        onPress={() => router.push("/eventScreens/paymentScreen")}
        style={[styles.continueButton]}
      />
    </Container>
  );
};

export default TicketDetails;
