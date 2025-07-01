import createStyles from '@/app/eventScreens/styles/events.styles';
import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { Colors } from '@/constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { FlatList, useColorScheme, View } from 'react-native';
import EventCard from './components/EventCard';


const dummyEvents = [
  {
    id: '1',
    title: 'Designers Meetup 2022',
    date: '03 October, 22',
    location: 'Gulshan, Dhaka',
    price: '$10. USD',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
  },
  {
    id: '2',
    title: 'Developers Conference',
    date: '12 November, 22',
    location: 'Colombo, SL',
    price: '$25. USD',
    imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f',
  },
  {
    id: '3',
    title: 'Tech Bootcamp 2023',
    date: '01 Jan, 23',
    location: 'Bangalore, India',
    price: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  },
];



const Events = () => {

 const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);


  return (
    <Container customStyle={styles.mainContainer}>
      <View style={styles.headerContainer}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={Colors[theme].primary} />
        </View>
        {/* Title */}
        <View style={styles.titleContainer}>
          <RnText style={styles.titleText}>Events</RnText>
        </View>
        {/* Right Icons */}
        <View style={styles.iconsContainer}>
          <Feather name="search" size={24} color={Colors[theme].primary} />
          <Entypo name="dots-three-vertical" size={24} color={Colors[theme].primary} />
        </View>

       
      </View>
      <View style={styles.detailsContainer}>
      <FlatList
        data={dummyEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            date={item.date}
            location={item.location}
            price={item.price}
            imageUrl={item.imageUrl}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
    </Container>
  );
};

export default Events;


