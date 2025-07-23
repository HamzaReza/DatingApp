export interface User {
  id: string;
  name: string;
  profileImage?: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName?: string;
  senderImage?: string;
  content: string;
  timestamp: Date | FirestoreTimestamp;
  isRead: boolean;
  messageType: "text" | "image" | "audio";
  mediaUrl?: string;
}
