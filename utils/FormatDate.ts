import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export const formatMessageDate = (
  date: Date | string | FirebaseFirestoreTypes.Timestamp
): string => {
  const messageDate =
    date instanceof Date
      ? date
      : typeof date === "string"
      ? new Date(date)
      : date.toDate();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDay = new Date(messageDate);
  messageDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (messageDay.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const parseDate = (
  date: Date | string | FirebaseFirestoreTypes.Timestamp
): Date => {
  // If it's already a Date object
  if (date instanceof Date) {
    return date;
  }

  // If it's a Firestore Timestamp (check for both React Native Firebase and standard Firestore formats)
  if (typeof date === "object" && date !== null) {
    // Check for React Native Firebase format
    if ("toDate" in date && typeof date.toDate === "function") {
      return (date as FirebaseFirestoreTypes.Timestamp).toDate();
    }

    // Check for standard Firestore format with seconds and nanoseconds
    if ("seconds" in date && "nanoseconds" in date) {
      // Convert Firestore timestamp to JavaScript Date
      return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    }
  }

  // If it's a string (ISO format or other)
  if (typeof date === "string") {
    // Try parsing as ISO string first
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    } else {
      console.log("❌ Failed to parse string date");
    }
  }

  // If all else fails, return current date or throw error
  console.error("❌ Unable to parse date:", date);
  return new Date();
};

export const formatTimeAgo = (
  date: Date | string | FirebaseFirestoreTypes.Timestamp
): string => {
  const dateObj = parseDate(date);

  if (isNaN(dateObj.getTime())) {
    console.log("❌ Invalid date object");
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
