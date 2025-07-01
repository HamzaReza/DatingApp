import createStyles from '@/app/eventScreens/styles/ticketDetails.styles'
import Container from '@/components/RnContainer'
import RnText from '@/components/RnText'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { TouchableOpacity, useColorScheme, View } from 'react-native'
import EventButton from './components/EventButton'
import CustomHeader from './components/EventHeader'


const ticketDetails = () => {

const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);


  const [selected, setSelected] = useState<'vip' | 'economy'>('vip');
  const [seatCount, setSeatCount] = useState(1);

  const handleDecrease = () => {
    if (seatCount > 1) setSeatCount(seatCount - 1);
  };
  const handleIncrease = () => setSeatCount(seatCount + 1);

  return (
    <Container customStyle={styles.mainContainer}>
     <CustomHeader title='Ticket Details' onBackPress={function (): void {
        throw new Error('Function not implemented.')
      } }/>
      <RnText style={styles.ticketTypeHeader}>Ticket Type</RnText>

      {/* Ticket Type Tabs */}
    <View style={styles.tabContainer}>
  <TouchableOpacity
    style={[
      styles.tabButton,
      styles.vipButton,
      selected === 'vip' && styles.tabButtonActive,
    ]}
    onPress={() => setSelected('vip')}
  >
    <RnText style={[
      styles.tabText,
      selected === 'vip' && styles.tabTextActive,
    ]}>
      VIP
    </RnText>
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.tabButton,
      styles.economyButton, 
      selected === 'economy' && styles.tabButtonActive,
    ]}
    onPress={() => setSelected('economy')}
  >
    <RnText style={[
      styles.tabText,
      selected === 'economy' && styles.tabTextActive,
    ]}>
      Economy
    </RnText>
  </TouchableOpacity>
</View>

      {/* Seat Selector */}
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
  >
    <RnText style={styles.seatButtonText}>+</RnText>
  </TouchableOpacity>
</View>
      </View>

<RnText style={styles.ticketTypeHeader}>Ticket Price</RnText>
<View style={styles.singlePriceContainer}>
<RnText>{selected} Ticket</RnText>
<RnText>$500</RnText>
</View>
<RnText style={styles.mutiplyText}>{seatCount} X $500</RnText>

<View style={styles.horizontaLine}>
</View>
    <View style={styles.singlePriceContainer}>
<RnText style={styles.totalPrice}>Total Price</RnText>
<RnText style={styles.totalPrice}>$500</RnText>
    </View>
    <View style={styles.buttonContainer}>
      <EventButton
      onPress={()=>router.push('/eventScreens/paymentScreen')}
      />  
    </View>


    </Container>
  )
}

export default ticketDetails

