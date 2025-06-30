import styles from '@/app/eventScreens/styles/eventDetails.styles';
import RnText from '@/components/RnText';
import RoundButton from '@/components/RoundButton';
import { Colors } from '@/constants/Colors';
import { hp, wp } from '@/utils';
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';

const EventDetails = () => {
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: hp(16) }}>
        {/* 1. Header Image */}
        <View style={styles.backgroundImageContainer}>
          <ImageBackground
            source={{
              uri: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400',
            }}
            style={styles.backgroundImage}
          >
            {/* Header Actions */}
            <View style={styles.header}>
              <RoundButton iconName={'arrow-back'} backgroundColour={Colors.light.background} iconColor={Colors.light.pink} onPress={()=>router.back()} />
              <View style={styles.subheader}>
                <RoundButton iconName={'share'} backgroundColour={Colors.light.background} iconColor={Colors.light.pink} onPress={()=>router.back()}/>
                <RoundButton iconName={'favorite'} backgroundColour={Colors.light.background} iconColor={Colors.light.pink}/>
              </View>
            </View>

            {/* Date + Place + Title */}
            <View>
              <View style={styles.datePlaceContainer}>
                <RnText style={styles.dateText}>13th March</RnText>
                <Entypo name="dot-single" size={30} color={Colors.light.whiteText} />
                <RnText style={styles.dateText}>Ahmedabad</RnText>
              </View>
              <RnText style={styles.nameText}>Ghar by Zakir Khan</RnText>
            </View>
          </ImageBackground>
        </View>

        {/* 2. Venue Info */}
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>Venue</RnText>
          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={20} color={Colors.light.pink} />
            <RnText>The Cheese Box Studios, Ahmedabad</RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons name="drama-masks" size={20} color={Colors.light.pink} />
            <RnText>Comedy</RnText>
            <View style={{ width: wp(4) }} />
            <Ionicons name="calendar-outline" size={20} color={Colors.light.pink} />
            <RnText>13th Mar, Saturday</RnText>
          </View>
          <View style={styles.venueRow}>
            <MaterialCommunityIcons name="clock-time-five-outline" size={20} color={Colors.light.pink} />
            <RnText>7:00 - 9:00 PM</RnText>
          </View>
        </View>

        {/* 3. Creator */}
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>Creator</RnText>
          <View style={styles.creatorRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d' }}
              style={styles.creatorImage}
            />
            <RnText style={styles.creatorName}>Zakir Khan</RnText>
            <View style={{ flex: 1 }} />
            <RnText style={styles.likesText}>5.6K</RnText>
            <FontAwesome name="heart-o" size={20} color={Colors.light.pink} style={{ marginLeft: wp(1) }} />
          </View>
        </View>

        {/* 4. About Event */}
        <View style={styles.section}>
          <RnText style={styles.sectionTitle}>About this event</RnText>
          <RnText style={styles.aboutText}>
            Zakir Khan is well known for his comedy timing and{"\n"}his storytelling is also popular amongst the young people
            Zakir Khan is well known for his comedy timing and{"\n"}his storytelling is also popular amongst the young people
            Zakir Khan is well known for his comedy timing and{"\n"}his storytelling is also popular amongst the young people
          </RnText>
        </View>
      </ScrollView>

      {/* 5. Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.priceContainer}>
          <RnText style={styles.priceText}>500 ₹</RnText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={()=>router.push('/eventScreens/ticketDetails')}>
          <RnText style={styles.buyText}>Buy Tickets</RnText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetails;

