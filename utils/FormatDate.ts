// utils/dateUtils.ts
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

  // Reset time parts for comparison
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
