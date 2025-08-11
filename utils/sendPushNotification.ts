export const sendPushNotification = async notificationData => {
  const ONESIGNAL_API_KEY =
    "os_v2_app_m5zqqyjr2jhvzmynnb36irouzoojreapj5heu7uxrv57qztpanfns43uaiduj33qnxss23gfectlpnbfwidld2lappg4f2x6idgsa2q"; // Replace with your actual key
  const ONESIGNAL_APP_ID = "67730861-31d2-4f5c-b30d-6877e445d4cb"; // Replace with your actual app ID

  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Key ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        ...notificationData,
      }),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
};

// Enhanced Notification Templates with Customization
export const NotificationTemplates = {
  // Basic notification with full customization
  basic: (title, message, options = {}) => ({
    headings: { en: title },
    contents: { en: message },
    ...options,
  }),

  // Marketing notification with image
  marketing: (title, message, imageUrl, deepLink) => ({
    headings: { en: title },
    contents: { en: message },
    big_picture: imageUrl,
    ios_attachments: { id: "image", url: imageUrl },
    url: deepLink,
    buttons: [
      { id: "view", text: "View Offer" },
      { id: "later", text: "Maybe Later" },
    ],
  }),

  // Personalized user notification
  personal: (userName, message) => ({
    headings: { en: `Hi ${userName}!` },
    contents: { en: message },
    android_group: "personal",
    collapse_id: "personal_msg",
  }),

  // Urgent/important notification
  urgent: (title, message) => ({
    headings: { en: `❗ ${title}` },
    contents: { en: message },
    priority: 10,
    ttl: 3600, // expire after 1 hour if not delivered
  }),
};

// Targeting Methods
export const TargetMethods = {
  // Send to specific user by their OneSignal player ID
  toPlayer: playerId => ({
    include_player_ids: [playerId],
  }),

  // Send to multiple specific users
  toPlayers: playerIds => ({
    include_player_ids: playerIds,
  }),

  // Send to users with specific tags
  toUsersWithTags: tags => ({
    filters: Object.entries(tags).map(([key, value]) => ({
      field: "tag",
      key,
      relation: "=",
      value,
    })),
  }),

  // Send to users who haven't used the app in X days
  toInactiveUsers: days => ({
    filters: [
      {
        field: "last_session",
        relation: "<",
        value: days.toString(),
        hours_ago: days * 24,
      },
    ],
  }),

  // Send to users in specific segment
  toSegment: segmentName => ({
    included_segments: [segmentName],
  }),
};
