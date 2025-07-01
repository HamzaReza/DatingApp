import createStyles from '@/app/eventScreens/styles/paymentScreen.styles';
import Container from "@/components/RnContainer";
import RnInput from "@/components/RnInput";
import RnModal from "@/components/RnModal";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { wp } from "@/utils";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import EventButton from "./components/EventButton";
import CustomHeader from "./components/EventHeader";


const paymentMethods = [
  {
    id: "apple",
    name: "Apple Pay",
    icon: <AntDesign name="apple1" size={24} color="black" />,
    selected: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <FontAwesome5 name="paypal" size={24} color="#003087" />,
    selected: false,
  },
  {
    id: "google",
    name: "Google Pay",
    icon: <FontAwesome5 name="google-pay" size={24} color="#5F6368" />,
    selected: false,
  },
];

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("apple");
  const [voucher, setVoucher] = useState("");
  const [modalVisible,setModalVisible] = useState(false)


const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  
  return (
    <>
    <Container customStyle={{backgroundColor:Colors[theme].backgroundSecondary}} >


      <CustomHeader title="Payment" rightIcon="scan" onRightPress={() => router.push('/eventScreens/cardScan')} onBackPress={function (): void {
          throw new Error('Function not implemented.');
        } }/>

      <View style={styles.section}>
        <RnText style={styles.label}>Payment Method</RnText>
        <TouchableOpacity style={styles.addCard} onPress={()=>setModalVisible(true)}>
          <RnText style={styles.addCardText}>Add New Card</RnText>
        </TouchableOpacity>
      </View>

      {/* Payment Options */}
      {paymentMethods.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.methodButton}
          onPress={() => setSelectedMethod(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.radioRow}>
            <View style={selectedMethod === item.id ? styles.selectedRadio : styles.unselectedRadio}>
              {selectedMethod === item.id && <View style={styles.radioDot} />}
            </View>
            {item.icon}
            <RnText style={styles.methodName}>{item.name}</RnText>
          </View>
        </TouchableOpacity>
      ))}

      {/* Debit/Credit Option */}
      <TouchableOpacity style={styles.radioRowForPayment}>
        <View style={styles.unselectedRadio} />
        <RnText style={styles.methodName}>Pay by Debit / Credit Card</RnText>
      </TouchableOpacity>

      {/* Existing Card */}
      <View style={styles.cardItem}>
        <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />
        <RnText style={styles.cardText}>**** **** **** 0213</RnText>
      </View>

      {/* Voucher */}
      <View style={styles.voucherSection}>
        <RnText style={styles.label}>Add Voucher</RnText>
        <View style={styles.voucherContainer}>
          <TextInput
            placeholder="VOUCHER CODE"
            style={styles.voucherInput}
            placeholderTextColor={Colors[theme].redText}
            value={voucher}
            onChangeText={setVoucher}
          />
          <TouchableOpacity style={styles.applyButton}>
            <RnText style={styles.applyText}>Apply</RnText>
          </TouchableOpacity>
        </View>
      </View>

      <EventButton title="Checkout" onPress={()=>router.push('/eventScreens/ticket')}/>

<RnModal show={modalVisible} backButton={()=>setModalVisible(false)}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBackground}>

      {/* Card Number */}
      <RnText style={styles.inputlabel}>Card Number</RnText>
      <RnInput
        placeholder="3456 133112 50832"
        containerStyle={styles.inputField}
        inputContainerStyle={styles.inputInner}
        style={styles.input}
      />

      {/* Expiry & CVV */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: wp(2) }}>
          <RnText style={styles.inputlabel}>Expires End</RnText>
          <RnInput
            placeholder="07/22"
            containerStyle={styles.inputField}
            inputContainerStyle={styles.inputInner}
            style={styles.input}
          />
        </View>
        <View style={{ flex: 1 }}>
          <RnText style={styles.inputlabel}>CVV</RnText>
          <RnInput
            placeholder="341"
            containerStyle={styles.inputField}
            inputContainerStyle={styles.inputInner}
            style={styles.input}
            
          />
        </View>
      </View>

      {/* Save checkbox */}
      <View style={styles.saveRow}>
        <View style={styles.circleCheck} />
        <RnText style={styles.saveLabel}>Save as a Primary Card</RnText>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmBtn}>
        <RnText style={styles.confirmText}>Confirm</RnText>
      </TouchableOpacity>

    </View>
  </View>
</RnModal>

    </Container>

   
</>
  );
};

export default PaymentScreen;

