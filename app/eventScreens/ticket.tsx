import createStyles from '@/app/eventScreens/styles/ticket.styles';
import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { Colors } from '@/constants/Colors';
import { wp } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';
import CustomHeader from './components/EventHeader';


const TicketScreen = () => {


const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);


  return (
    <Container customStyle={{ backgroundColor: Colors[theme].backgroundSecondary }}>
      <CustomHeader
        title="Tickets"
        onBackPress={() => {}}
        rightIcon="scan-outline"
        onRightPress={() => {}}
      />

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
            <Image
              source={require('@/assets/images/qr.png')} // Replace with real QR or SVG
              style={styles.qr}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Download Button */}
      <TouchableOpacity style={styles.downloadBtn}>
        <RnText style={styles.downloadText}>Download Image</RnText>
        <Ionicons name="download-outline" size={20} color={Colors[theme].whiteText} style={{ marginLeft: wp(2) }} />
      </TouchableOpacity>
    </Container>
  );
};

export default TicketScreen;

