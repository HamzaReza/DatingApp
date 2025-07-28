import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type RejectModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { unavailable: string[]; reason: string }) => void;
};

export default function RejectModal({
  visible,
  onClose,
  onSubmit,
}: RejectModalProps) {
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [reason, setReason] = useState("");

  const toggleOption = (option: string) => {
    setUnavailable(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (unavailable.length === 0) return;
    onSubmit({ unavailable, reason });
    setUnavailable([]);
    setReason("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reject Meeting</Text>

          <Text style={styles.subtitle}>Select unavailable options:</Text>
          {["Place", "Date", "Time"].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                unavailable.includes(option) && styles.optionSelected,
              ]}
              onPress={() => toggleOption(option)}
            >
              <Ionicons
                name={
                  unavailable.includes(option) ? "checkbox" : "square-outline"
                }
                size={20}
                color={Colors.light.primary}
              />
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholder="Optional reason..."
            value={reason}
            onChangeText={setReason}
            style={styles.input}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  optionSelected: {
    backgroundColor: "#f4f4f4",
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  input: {
    marginTop: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelBtn: {
    padding: 10,
  },
  cancelText: {
    color: "#888",
  },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 10,
  },
  submitText: {
    color: "#fff",
  },
});
