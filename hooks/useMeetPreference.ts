import { useState } from "react";

interface UseMeetingPreferencesReturn {
  selectedPlaces: string[];
  selectedDates: string[];
  selectedTimes: string[];
  showDatePicker: boolean;

  togglePlace: (placeName: string) => void;
  toggleTimeSlot: (time: string) => void;
  handleDateSelect: (event: any, date?: Date) => void;
  setShowDatePicker: (show: boolean) => void;
  removeDate: (date: string) => void;
}

export const useMeetingPreferences = (): UseMeetingPreferencesReturn => {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const togglePlace = (placeName: string) => {
    setSelectedPlaces(prev =>
      prev?.includes(placeName)
        ? prev?.filter(p => p !== placeName)
        : [...prev, placeName]
    );
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes(prev =>
      prev?.includes(time) ? prev?.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleDateSelect = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const iso = date.toISOString().split("T")[0];
      setSelectedDates(prev =>
        prev?.includes(iso) ? prev.filter(d => d !== iso) : [...prev, iso]
      );
    }
  };

  const removeDate = (date: string) => {
    setSelectedDates(prev => prev.filter(d => d !== date));
  };

  return {
    selectedPlaces,
    selectedDates,
    selectedTimes,
    showDatePicker,
    togglePlace,
    toggleTimeSlot,
    handleDateSelect,
    setShowDatePicker,
    removeDate,
  };
};
