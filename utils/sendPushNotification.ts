import axios from "axios";

// const APP_ID = process.env.ONESIGNAL_APP_ID;
// const API_KEY = process.env.ONESIGNAL_API_KEY;

const APP_ID = "67730861-31d2-4f5c-b30d-6877e445d4cb";
const API_KEY =
  "os_v2_app_m5zqqyjr2jhvzmynnb36irouzoojreapj5heu7uxrv57qztpanfns43uaiduj33qnxss23gfectlpnbfwidld2lappg4f2x6idgsa2q";

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
