import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { wp } from '@/utils';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type Props = {
  title: string;
  date: string;
  location: string;
  price: string;
  imageUrl: string;
};


const EventCard = ({ title, date, location, price, imageUrl }: Props) => {

 const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
 const styles = createStyles(theme)

  return (
    <View style={styles.cardContainer}>
      {/* 1. Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* 2. Info + Action Container */}
      <View style={styles.rightSection}>
        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.subInfo}>
            <Text style={styles.date}>{date}</Text>
            <Entypo name="dot-single" size={16} color="red" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        {/* Action */}
        <View style={styles.actionContainer}>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity onPress={()=>router.push('/eventScreens/eventDetails')}>
            <Text style={styles.joinNow}>JOIN NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventCard;

const createStyles = (theme:'dark'|'light')=>StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: Colors[theme].background,
    borderRadius: Borders.radius2,
    padding: wp(3),
    marginVertical: wp(2),
    alignItems: 'center',
    width: wp(92),
    alignSelf: 'center',
  },
  imageContainer: {
    width: wp(18),
    height: wp(18),
    borderRadius: Borders.radius2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: wp(3),
  },
  infoContainer: {
    flex: 2,
    justifyContent: 'center',
    marginRight: wp(2),
  },
  title: {
    fontSize: FontSize.small,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
    color: Colors[theme].blackText,
  },
  subInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(1),
  },
  date: {
    color: Colors[theme].tabIconDefault,
    fontSize: FontSize.extraSmall,
  },
  location: {
   color: Colors[theme].tabIconDefault,
    fontSize: FontSize.extraSmall,
  },
  actionContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: wp(2),
    paddingVertical: wp(1),
  },
  price: {
    color: 'red',
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  joinNow: {
    marginTop: wp(2),
    fontWeight: 'bold',
    fontSize: FontSize.extraSmall,
    color: '#111',
  },
});