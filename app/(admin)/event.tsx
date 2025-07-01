import createStyles from "@/app/adminStyles/event.styles";
import RnButton from "@/components/RnButton";
import RnContainer from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { adminEvents } from "@/constants/adminEvents";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AdminEvent } from "@/types/Admin";
import { hp, wp } from "@/utils";
import React from "react";
import { FlatList, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function AdminEventTicketScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  const renderTicketCard = ({ item: event }: { item: AdminEvent }) => {
    return (
      <View style={styles.ticketCardWrapper}>
        <View style={styles.ticketCard}>
          <RnText style={styles.eventTitle}>{event.name}</RnText>
          <View style={styles.rowWrap}>
            <View>
              <RnText style={styles.label}>Date</RnText>
              <RnText style={styles.value}>{event.date}</RnText>
            </View>
            <View>
              <RnText style={styles.label}>Time</RnText>
              <RnText style={styles.value}>{event.time}</RnText>
            </View>
          </View>
          <View style={styles.rowWrap}>
            <View>
              <RnText style={styles.label}>Genre</RnText>
              <RnText style={styles.value}>
                {event.genre.charAt(0).toUpperCase() + event.genre.slice(1)}
              </RnText>
            </View>
            <View>
              <RnText style={styles.label}>Seat</RnText>
              <RnText style={styles.value}>{event.seat}</RnText>
            </View>
          </View>
          <View>
            <RnText style={styles.label}>Venue</RnText>
            <RnText style={styles.value}>{event.venue}</RnText>
          </View>
          <View style={styles.dashedLine} />
          <QRCode
            value={event.id + "-" + event.name}
            size={hp(20)}
            logo={require("@/assets/images/react-logo.png")}
          />
        </View>
      </View>
    );
  };

  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>Event</RnText>
      <View>
        <FlatList
          data={adminEvents}
          renderItem={renderTicketCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: wp(1) }} />}
          snapToInterval={wp(90) + wp(1)}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>
      <RnButton
        title="Create a event"
        style={[styles.createBtn]}
        onPress={() => {}}
      />
    </RnContainer>
  );
}
