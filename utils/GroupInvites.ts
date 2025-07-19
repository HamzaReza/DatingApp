// utils/groupRequests.ts
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, doc, updateDoc } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export const sendGroupRequest = async (targetId: string) => {
  const db = getFirestore();
  const currentUserId = auth().currentUser?.uid;
  
  if (!currentUserId) throw new Error("User not authenticated");

  // Check if request already exists
  const existingRequest = await getDocs(
    query(
      collection(db, "group_requests"),
      where("creatorId", "==", currentUserId),
      where("targetId", "==", targetId)
    )
  );

  if (!existingRequest.empty) {
    throw new Error("Request already sent to this user");
  }

  await addDoc(collection(db, "group_requests"), {
    creatorId: currentUserId,
    targetId,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const checkExistingRequest = async (targetId: string) => {
  const db = getFirestore();
  const currentUserId = auth().currentUser?.uid;
  
  const snapshot = await getDocs(
    query(
      collection(db, "group_requests"),
      where("creatorId", "==", currentUserId),
      where("targetId", "==", targetId)
    )
  );

  return !snapshot.empty;
};