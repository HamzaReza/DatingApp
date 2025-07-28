// Helper functions for meeting screen

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const validateMeetingForm = (
  selectedPlaces: string[],
  selectedDates: string[],
  selectedTimes: string[],
  fixedDetails: { placeFixed: boolean; dateFixed: boolean; timeFixed: boolean },
  rejectionStatus: { date: boolean; time: boolean; place: boolean }
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  if (!fixedDetails.placeFixed && !selectedPlaces.length) {
    if (rejectionStatus.place) {
      missingFields.push(
        "You rejected the *place* field. Please set your availability preference."
      );
    } else {
      missingFields.push("Please select at least one *place*.");
    }
  }

  if (!fixedDetails.dateFixed && !selectedDates.length) {
    if (rejectionStatus.date) {
      missingFields.push(
        "You rejected the *date* field. Please set your availability preference."
      );
    } else {
      missingFields.push("Please select at least one *date*.");
    }
  }

  if (!fixedDetails.timeFixed && !selectedTimes.length) {
    if (rejectionStatus.time) {
      missingFields.push(
        "You rejected the *time* field. Please set your availability preference."
      );
    } else {
      missingFields.push("Please select at least one *time*.");
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const timeSlots = [
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
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "4:30 PM",
];

export const districtPlaces = [
  { id: "1", name: "Place 1", icon: "leaf-outline" },
  { id: "2", name: "Place 2", icon: "cafe-outline" },
  { id: "3", name: "Place 3", icon: "color-palette-outline" },
  { id: "4", name: "Place 4", icon: "water-outline" },
  { id: "5", name: "Place 5", icon: "storefront-outline" },
];

export const mockUsers = {
  currentUser: {
    id: "1",
    name: "You",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  otherUser: {
    id: "2",
    name: "Jessica",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
};
