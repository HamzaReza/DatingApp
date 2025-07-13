import createStyles from "@/app/eventScreens/styles/ticketDetails.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { fetchEventTicketInfo } from "@/firebase/event";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const TicketDetails = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const params = useLocalSearchParams();
  const eventId = params.id as string;

  const [selected, setSelected] = useState<"Economy" | "Vip">("Economy");
  const [seatCount, setSeatCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState<{
    normalTicket: number;
    vipTicket: number;
    normalTicketSold: number;
    vipTicketSold: number;
    normalTicketPrice: number;
    vipTicketPrice: number;
  } | null>(null);

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      const unsubscribe = fetchEventTicketInfo(
        eventId,
        (
          data: {
            normalTicket: number;
            vipTicket: number;
            normalTicketSold: number;
            vipTicketSold: number;
            normalTicketPrice: number;
            vipTicketPrice: number;
          } | null
        ) => {
          setTicketData(data);
          setIsLoading(false);
        }
      );

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [eventId]);

  const getCurrentTicketPrice = () => {
    if (!ticketData) return 0;
    return selected === "Vip"
      ? ticketData.vipTicketPrice
      : ticketData.normalTicketPrice;
  };

  const getAvailableTickets = () => {
    if (!ticketData) return 0;
    return selected === "Vip" ? ticketData.vipTicket : ticketData.normalTicket;
  };

  const currentPrice = getCurrentTicketPrice();
  const availableTickets = getAvailableTickets();

  const handleDecrease = useCallback(() => {
    if (seatCount > 1) setSeatCount(seatCount - 1);
  }, [seatCount]);

  const handleIncrease = useCallback(() => {
    if (seatCount < availableTickets) setSeatCount(seatCount + 1);
  }, [seatCount, availableTickets]);

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
        <RnText style={styles.headerText}>Ticket Details</RnText>
        <RoundButton noShadow />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors[theme].primary} />
          <RnText style={styles.loaderText}>
            Loading ticket information...
          </RnText>
        </View>
      ) : (
        <>
          <RnText style={styles.ticketTypeHeader}>Ticket Type</RnText>

          <View style={styles.tabContainer}>
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
              onPress={() => {
                if (selected !== "Economy") {
                  setSelected("Economy");
                  setSeatCount(1);
                }
              }}
            />
            <RnButton
              title="VIP"
              onPress={() => {
                if (selected !== "Vip") {
                  setSelected("Vip");
                  setSeatCount(1);
                }
              }}
              style={[
                [
                  styles.tabButton,
                  styles.vipButton,
                  selected === "Vip" && styles.tabButtonActive,
                ],
                styles.tabText,
              ]}
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
              <TouchableOpacity
                style={styles.seatButton}
                onPress={handleIncrease}
                disabled={seatCount >= availableTickets}
              >
                <RnText style={styles.seatButtonText}>+</RnText>
              </TouchableOpacity>
            </View>
          </View>
          {ticketData && (
            <RnText style={styles.availableTickets}>
              {availableTickets} tickets available
            </RnText>
          )}

          <RnText style={styles.ticketTypeHeader}>Ticket Price</RnText>
          <View style={styles.singlePriceContainer}>
            <RnText>{selected} Ticket</RnText>
            <RnText>${currentPrice}</RnText>
          </View>
          <RnText style={styles.mutiplyText}>
            {seatCount} X $ {currentPrice}
          </RnText>

          <View style={styles.horizontaLine}></View>
          <View style={styles.singlePriceContainer}>
            <RnText style={styles.totalPrice}>Total Price</RnText>
            <RnText style={styles.totalPrice}>
              ${seatCount * currentPrice}
            </RnText>
          </View>
          <RnButton
            title="Continue"
            onPress={() => {
              let params = {};
              if (selected === "Economy") {
                params = {
                  normalTicketPurchased: seatCount,
                  vipTicketPurchased: 0,
                };
              } else {
                params = {
                  normalTicketPurchased: 0,
                  vipTicketPurchased: seatCount,
                };
              }
              router.push({
                pathname: "/eventScreens/tickets/paymentScreen",
                params: { ...params, eventId: eventId },
              });
            }}
            style={[styles.continueButton]}
            disabled={!ticketData || availableTickets === 0}
          />
        </>
      )}
    </Container>
  );
};

export default TicketDetails;
