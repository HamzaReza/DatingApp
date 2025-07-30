import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "@react-native-firebase/firestore";

type NotificationType = "like" | "match" | "message" | "custom"; // Expandable

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
      ? notifSnap.data().items || []
      : [];

    const newNotification = {
      title,
      subtitle,
      type,
      //   createdAt: serverTimestamp(),
      data,
    };

    const updatedNotifications = [newNotification, ...existingNotifications];

    await setDoc(notifRef, { items: updatedNotifications }, { merge: true });

    console.log("Notification saved successfully");
  } catch (error) {
    console.error("Error sending in-app notification:", error);
  }
};
