import axios from "axios";

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
const API_KEY = process.env.EXPO_PUBLIC_ONESIGNAL_API_KEY;

type NotificationPayload = {
  app_id: string | undefined;
  include_external_user_ids: string[];
  headings: { en: string };
  contents: { en: string };
  data?: Record<string, any>;
};

type NotificationParam = {
  toUserId: string[];
  title: string;
  subtitle: string;
  data?: Record<string, any>;
};

export async function sendPushNotification({
  toUserId,
  title,
  subtitle,
  data,
}: NotificationParam) {
  try {
    const notification: NotificationPayload = {
      app_id: APP_ID,
      include_external_user_ids: toUserId,
      headings: { en: title },
      contents: { en: subtitle },
    };

    if (data) {
      notification.data = data;
    }

    await axios.post("https://api.onesignal.com/notifications", notification, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${API_KEY}`,
      },
    });
  } catch (error: any) {
    console.error(
      "Error sending notification:",
      error.response?.data || error.message
    );
  }
}
