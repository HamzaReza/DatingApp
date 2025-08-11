import axios from "axios";

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_API_KEY;

export async function sendNotification(
  userIds: string,
  title: string,
  message: any
) {
  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      {
        app_id: APP_ID,
        include_external_user_ids: userIds, // ["user1", "user2"]
        headings: { en: title },
        contents: { en: message },
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${API_KEY}`,
        },
      }
    );

    console.log("Notification sent:", response.data);
  } catch (error: any) {
    console.error(
      "Error sending notification:",
      error.response?.data || error.message
    );
  }
}
