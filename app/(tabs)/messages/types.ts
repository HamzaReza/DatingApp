export interface User {
  id: string;
  name: string;
  profileImage?: string;
  photo: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName?: string;
  senderImage?: string;
  content: string;
  timestamp: any;
  isRead: boolean;
  messageType: "text" | "image" | "audio";
  mediaUrl?: string;
  photo: string;
}
