const formatTimeAgo = (timestamp: any) => {
  if (!timestamp?.seconds) return "";

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let dayString = "";
  if (diffDays === 0) {
    dayString = "Today";
  } else if (diffDays === 1) {
    dayString = "Yesterday";
  } else {
    dayString = `${diffDays} days ago`;
  }

  const timeString = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dayString}, ${timeString}`;
};
