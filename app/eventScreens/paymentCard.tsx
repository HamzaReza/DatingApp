import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { Borders } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from './components/EventHeader';

const PaymentCard = () => {


const cardData = [
  {
    id: '1',
    name: 'Yuuji Itadori',
    number: '**** 5652 3356 3447',
    exp: '09/24',
    bgColor: '#FF7B8A',
  },
  {
    id: '2',
    name: 'Megumi Fushiguro',
    number: '**** 9876 5432 1098',
    exp: '11/25',
    bgColor: '#70D6FF',
  },
  {
    id: '3',
    name: 'Nobara Kugisaki',
    number: '**** 1122 3344 5566',
    exp: '04/26',
    bgColor: '#FFD670',
  },
];


  return (
    <Container customStyle={styles.container}>
      {/* Header */}
     <CustomHeader title='Payment'/>

     <RnText style={styles.sectionTitle}>Payment Method</RnText>

    <FlatList
  horizontal
  data={cardData}
  keyExtractor={(item) => item.id}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ gap: wp(3) }}
  renderItem={({ item }) => (
    <View style={[styles.card, { backgroundColor: item.bgColor }]}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardName}>{item.name}</Text>
        <View style={styles.cardChip} />
      </View>

      <Text style={styles.cardNumber}>{item.number}</Text>
      <Text style={styles.cardExp}>Exp <Text style={{ fontWeight: 'bold' }}>{item.exp}</Text></Text>

      <View style={styles.decorCircle} />
      <View style={styles.decorArrow} />
    </View>
    
    
  )}
/>


  
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,

  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    marginTop: wp(7),
    color: '#111',
    marginBottom:wp(5)
  },
  card: {
    width: wp(80),
    height: hp(20),
    backgroundColor: '#FF7B8A',
    borderRadius: Borders.radius2,
    padding: wp(5),
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: wp(5),
    marginLeft:wp(5)
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardName: {
    color: 'white',
    fontSize: FontSize.large,
    fontWeight: '600',
  },
  cardChip: {
    width: wp(6),
    height: wp(6),
    borderRadius:Borders.circle,
    backgroundColor: 'white',
  },
  cardNumber: {
    marginTop: wp(8),
    fontSize: FontSize.large,
    fontWeight: '600',
    color: '#111',
  },
  cardExp: {
    marginTop: wp(2),
    fontSize: FontSize.small,
    color: '#111',
  },
  confirmButton: {
    position: 'absolute',
    bottom: hp(3),
    alignSelf: 'center',
    backgroundColor: '#FF5E6C',
    paddingVertical: wp(3.5),
    paddingHorizontal: wp(30),
    borderRadius: Borders.radius4,
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
    fontSize:FontSize.small,
  },
  decorCircle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: '#CCF',
    borderRadius: 20,
    opacity: 0.3,
  },
  decorArrow: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 20,
    backgroundColor: '#B0B',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
});

