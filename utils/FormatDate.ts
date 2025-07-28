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
  // Handle null/undefined
  if (!date) {
    return new Date();
  }

  // Handle Date objects
  if (date instanceof Date) {
    return date;
  }

  // Handle Firebase Timestamp
  if (date && typeof date === "object" && "toDate" in date) {
    return date.toDate();
  }

  // Handle ISO date strings like "2025-07-25T13:03:31.963Z"
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  // Fallback for other types
  return new Date(date);
};

export const formatTimeAgo = (
  date: Date | string | FirebaseFirestoreTypes.Timestamp
): string => {
  const dateObj = parseDate(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
