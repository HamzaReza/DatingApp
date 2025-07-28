import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { getAuth } from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
} from "@react-native-firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontSize } from "@/constants/FontSize";
import { hp, wp } from "@/utils";
import { Colors } from "@/constants/Colors";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const districtPlaces = ["Place 1", "Place 2", "Place 3", "Place 4", "Place 5"]; // This should ideally come from Firestore or constants based on user's district

export default function MeetSetupScreen() {
  const { groupId } = useLocalSearchParams();
  const currentUser = getAuth().currentUser;
  const db = getFirestore();

  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const togglePlace = (place: string) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(prev => prev.filter(p => p !== place));
    } else {
      setSelectedPlaces(prev => [...prev, place]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedPlaces.length || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select places, date and time");
      return;
    }

    try {
      const meetRef = doc(
        db,
        "messages",
        String(groupId),
        "meet",
        currentUser?.uid!
      );
      await setDoc(meetRef, {
        userId: currentUser?.uid,
        places: selectedPlaces,
        date: selectedDate.toISOString(),
        time: selectedTime,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Meet preference saved!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Meeting Places</Text>
      <FlatList
        data={districtPlaces}
        horizontal
        contentContainerStyle={styles.placeList}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => togglePlace(item)}
            style={[
              styles.placeButton,
              selectedPlaces.includes(item) && styles.placeButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.placeText,
                selectedPlaces.includes(item) && styles.placeTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>
          {selectedDate ? selectedDate.toDateString() : "Pick Available Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <Text style={styles.title}>Select Time</Text>
      <FlatList
        data={timeSlots}
        numColumns={3}
        contentContainerStyle={styles.timeList}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedTime(item)}
            style={[
              styles.timeSlot,
              selectedTime === item && styles.timeSlotSelected,
            ]}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === item && styles.timeTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Submit Meet Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp(5), backgroundColor: "#fff" },
  title: {
    fontSize: FontSize.medium,
    marginVertical: hp(1),
    fontWeight: "bold",
  },
  placeList: { marginVertical: hp(1) },
  placeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 10,
    marginRight: wp(2),
  },
  placeButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  placeText: { color: "#333" },
  placeTextSelected: { color: "#fff" },
  dateButton: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    padding: hp(1.2),
    marginVertical: hp(2),
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: FontSize.small,
    color: "#000",
  },
  timeList: { paddingVertical: hp(1) },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: wp(3),
    borderRadius: 8,
    margin: wp(1),
    width: wp(25),
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: Colors.light.pink,
    borderColor: Colors.light.pink,
  },
  timeText: { fontSize: FontSize.small },
  timeTextSelected: { color: "#fff" },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    padding: hp(1.5),
    borderRadius: 12,
    marginTop: hp(3),
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: FontSize.medium,
    fontWeight: "600",
  },
});
