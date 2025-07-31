import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";

type NotificationType = "like" | "match" | "message" | "reel" | "custom"; // Expandable

type NotificationData = {
  toUserId: string;
  title: string;
  subtitle: string;
  type: NotificationType;
  data?: Record<string, any>; // 🔑 For additional dynamic data
};

export const sendInAppNotification = async ({
  toUserId,
  title,
  subtitle,
  type,
  data = {},
}: NotificationData) => {
  try {
    const db = getFirestore();
    const notifRef = doc(db, "notifications", toUserId);
    const notifSnap = await getDoc(notifRef);

    const existingNotifications = notifSnap.exists()
      ? (notifSnap.data()?.items as NotificationData[]) || []
      : [];

    const newNotification = {
      title,
      subtitle,
      type,
      data,
      isRead: false,
    };

    const updatedNotifications = [newNotification, ...existingNotifications];

    await setDoc(notifRef, { items: updatedNotifications }, { merge: true });
  } catch (error) {
    console.error("Error sending in-app notification:", error);
  }
};
