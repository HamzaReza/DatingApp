import createStyles from '@/app/eventScreens/styles/paymentCard.styles';
import Container from '@/components/RnContainer';
import RnText from '@/components/RnText';
import { wp } from '@/utils';
import React from 'react';
import { FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
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
const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <Container customStyle={styles.container}>
      {/* Header */}
     <CustomHeader title='Payment' onBackPress={function (): void {
        throw new Error('Function not implemented.');
      } }/>

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



