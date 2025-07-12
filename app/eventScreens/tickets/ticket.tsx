import createStyles from "@/app/eventScreens/styles/ticket.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import RoundButton from "@/components/RoundButton";
import { Colors } from "@/constants/Colors";
import { fetchEventById } from "@/firebase/event";
import { hp } from "@/utils/Dimensions";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

const TicketScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const { eventId } = useLocalSearchParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<View>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const unsubscribe = fetchEventById(eventId as string, (eventData: any) => {
      if (eventData) {
        setEvent(eventData);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [eventId]);

  const convertTimestampToDate = (timestamp: any) => {
    if (!timestamp) return null;

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      return timestamp;
    } else {
      return new Date(timestamp);
    }
  };

  const formatEventDate = (date: any) => {
    if (!date) return "";
    const dateObj = convertTimestampToDate(date);
    if (!dateObj || isNaN(dateObj.getTime())) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfMonth = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${dayOfMonth} ${month}, ${year}`;
  };

  const formatEventTime = (time: any) => {
    if (!time) return "";
    const timeObj = convertTimestampToDate(time);
    if (!timeObj || isNaN(timeObj.getTime())) return "";

    const hours = timeObj.getHours();
    const minutes = timeObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateQRValue = () => {
    return `TICKET-${eventId}-EVENT-${event.name
      ?.toUpperCase()
      .replace(/\s+/g, "-")}`;
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || !event) {
      showToaster({
        type: "error",
        heading: "Error",
        message: "Unable to download ticket",
      });
      return;
    }

    try {
      setDownloading(true);

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showToaster({
          type: "error",
          heading: "Permission Denied",
          message: "Please allow access to save the ticket to your gallery",
        });
        return;
      }

      // Capture the ticket as an image
      if (!ticketRef.current) {
        throw new Error("Ticket reference not available");
      }

      // Small delay to ensure view is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const capturedFilePath = await captureRef(ticketRef, {
        format: "png",
        quality: 0.9,
        result: "tmpfile",
      });
      if (!capturedFilePath) {
        throw new Error("Failed to capture ticket image");
      }

      // Save directly to media library
      const asset = await MediaLibrary.createAssetAsync(capturedFilePath);

      // Try to create album, but don't fail if it already exists
      try {
        await MediaLibrary.createAlbumAsync("Tickets", asset, false);
      } catch (albumError) {
        console.log("Album creation failed (might already exist):", albumError);
      }

      showToaster({
        heading: "Success!",
        message: "Ticket saved to your gallery",
      });
    } catch (error: any) {
      console.error("Error downloading ticket:", error);
      showToaster({
        type: "error",
        heading: "Download Failed",
        message: error?.message || "Unable to save ticket to gallery",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors[theme].primary} />
          <RnText style={{ marginTop: 10, color: Colors[theme].blackText }}>
            Loading ticket information...
          </RnText>
        </View>
      </Container>
    );
  }

  if (!event) {
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <RnText style={{ color: Colors[theme].blackText }}>
            Event not found
          </RnText>
        </View>
      </Container>
    );
  }

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
        <View ref={ticketRef} collapsable={false}>
          <View style={styles.ticketCard}>
            <View style={styles.ticketTopSection}>
              <RnText style={styles.eventTitle}>{event.name}</RnText>
              <View style={styles.rowWrap}>
                <View>
                  <RnText style={styles.label}>Date</RnText>
                  <RnText style={styles.value}>
                    {formatEventDate(event.date)}
                  </RnText>
                </View>
                <View>
                  <RnText style={styles.label}>Time</RnText>
                  <RnText style={styles.value}>
                    {formatEventTime(event.time)}
                  </RnText>
                </View>
              </View>
              <View style={styles.rowWrap}>
                <View>
                  <RnText style={styles.label}>Venue</RnText>
                  <RnText style={styles.value}>{event.venue}</RnText>
                </View>
                <View>
                  <RnText style={styles.label}>Seat</RnText>
                  <RnText style={styles.value}>05</RnText>
                </View>
              </View>
              <View>
                <RnText style={styles.label}>Genre</RnText>
                <RnText style={styles.value}>{event.genre}</RnText>
              </View>
            </View>

            {/* QR + Divider Section */}
            <View style={styles.ticketBottomSection}>
              <QRCode
                value={generateQRValue()}
                size={hp(20)}
                logo={
                  event.image
                    ? { uri: event.image }
                    : require("@/assets/images/react-logo.png")
                }
              />
            </View>
          </View>
        </View>
      </View>

      <RnButton
        title={downloading ? "Saving..." : "Download Image"}
        style={[styles.downloadBtn, styles.downloadText]}
        icon={downloading ? undefined : "download"}
        onPress={handleDownloadTicket}
        noRightIcon
        disabled={downloading}
        loading={downloading}
      />
    </Container>
  );
};

export default TicketScreen;
