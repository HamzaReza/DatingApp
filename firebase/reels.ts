import { getAuth } from "@react-native-firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@react-native-firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  putFile,
  ref,
} from "@react-native-firebase/storage";

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  visibility: "public" | "private";
  status: "approved" | "pending" | "rejected";
  likes: string[];
  dislikes: string[];
  comments: ReelComment[];
  createdAt: Date | string | FirebaseFirestoreTypes.Timestamp;
  updatedAt: Date | string | FirebaseFirestoreTypes.Timestamp;
}

export interface ReelComment {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  content: string;
  createdAt: Date | string | FirebaseFirestoreTypes.Timestamp;
}

const fetchUserReels = (callback: (reels: Reel[]) => void): (() => void) => {
  try {
    const db = getFirestore();
    const reelsRef = collection(db, "reels");

    const q = query(reelsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const reels: Reel[] = [];

        snapshot.forEach(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();

            // Filter for public visibility in the client side
            if (data.visibility === "public") {
              const reel: Reel = {
                id: doc.id,
                userId: data.userId,
                username: data.username,
                userPhoto: data.userPhoto,
                videoUrl: data.videoUrl,
                thumbnailUrl: data.thumbnailUrl,
                caption: data.caption,
                visibility: data.visibility || "public",
                status: data.status || "approved",
                likes: data.likes || [],
                dislikes: data.dislikes || [],
                comments: data.comments || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              };
              reels.push(reel);
            }
          }
        );

        callback(reels);
      },
      error => {
        console.error("Error in fetchUserReels listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up fetchUserReels listener:", error);
    throw error;
  }
};

const likeDislikeReel = async (
  reelId: string,
  userId: string,
  action: "like" | "dislike"
): Promise<void> => {
  try {
    if (!reelId || !userId) {
      throw new Error("Reel ID and User ID are required");
    }

    const db = getFirestore();
    const reelRef = doc(db, "reels", reelId);

    const reelDoc = await getDoc(reelRef);
    if (!reelDoc.exists()) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    const currentLikes = reelData?.likes || [];
    const currentDislikes = reelData?.dislikes || [];
    const reelOwnerId = reelData?.userId;

    let updatedLikes = [...currentLikes];
    let updatedDislikes = [...currentDislikes];

    if (action === "like") {
      if (currentDislikes.includes(userId)) {
        updatedDislikes = currentDislikes.filter((id: string) => id !== userId);
      }

      if (currentLikes.includes(userId)) {
        updatedLikes = currentLikes.filter((id: string) => id !== userId);
      } else {
        updatedLikes.push(userId);
      }
    } else if (action === "dislike") {
      if (currentLikes.includes(userId)) {
        updatedLikes = currentLikes.filter((id: string) => id !== userId);
      }

      if (currentDislikes.includes(userId)) {
        updatedDislikes = currentDislikes.filter((id: string) => id !== userId);
      } else {
        updatedDislikes.push(userId);
      }
    }

    await updateDoc(reelRef, {
      likes: updatedLikes,
      dislikes: updatedDislikes,
      updatedAt: serverTimestamp(),
    });

    if (reelOwnerId) {
      const userRef = doc(db, "users", reelOwnerId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userReels = userData?.reels || [];

        const updatedUserReels = userReels.map((userReel: any) => {
          if (userReel.id === reelId) {
            return {
              ...userReel,
              likes: updatedLikes,
              dislikes: updatedDislikes,
            };
          }
          return userReel;
        });

        await updateDoc(userRef, {
          reels: updatedUserReels,
        });
      }
    }
  } catch (error) {
    console.error(`Error ${action}ing reel:`, error);
    throw error;
  }
};

const addCommentToReel = async (
  reelId: string,
  content: string
): Promise<void> => {
  try {
    if (!reelId || !content) {
      throw new Error("Reel ID and comment content are required");
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User must be authenticated to add a comment");
    }

    const db = getFirestore();
    const reelRef = doc(db, "reels", reelId);
    const userRef = doc(db, "users", currentUser.uid);

    const reelDoc = await getDoc(reelRef);
    if (!reelDoc.exists()) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    const reelOwnerId = reelData?.userId;

    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();

    const newComment: ReelComment = {
      id: `${Date.now()}_${currentUser.uid}`,
      userId: currentUser.uid,
      username: userData?.name || "User",
      userPhoto: userData?.photo || "",
      content: content.trim(),
      createdAt: new Date(),
    };

    await updateDoc(reelRef, {
      comments: arrayUnion(newComment),
      updatedAt: serverTimestamp(),
    });

    if (reelOwnerId) {
      const reelOwnerRef = doc(db, "users", reelOwnerId);
      const reelOwnerDoc = await getDoc(reelOwnerRef);

      if (reelOwnerDoc.exists()) {
        const reelOwnerData = reelOwnerDoc.data();
        const userReels = reelOwnerData?.reels || [];

        const updatedUserReels = userReels.map((userReel: any) => {
          if (userReel.id === reelId) {
            const currentComments = userReel.comments || [];
            return {
              ...userReel,
              comments: [...currentComments, newComment],
            };
          }
          return userReel;
        });

        await updateDoc(reelOwnerRef, {
          reels: updatedUserReels,
        });
      }
    }
  } catch (error) {
    console.error("Error adding comment to reel:", error);
    throw error;
  }
};

const listenToReelComments = (
  reelId: string,
  callback: (comments: ReelComment[]) => void
): (() => void) => {
  try {
    if (!reelId) {
      console.error("Reel ID is required for listening to comments");
      return () => {};
    }

    const db = getFirestore();
    const reelRef = doc(db, "reels", reelId);

    const unsubscribe = onSnapshot(
      reelRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const comments: ReelComment[] = data?.comments || [];
          callback(comments);
        } else {
          callback([]);
        }
      },
      error => {
        console.error("Error in listenToReelComments listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up listenToReelComments listener:", error);
    return () => {};
  }
};

const uploadReel = async (
  videoUri: string,
  thumbnailUri?: string,
  caption?: string
): Promise<string> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User must be authenticated to upload a reel");
    }

    if (!videoUri) {
      throw new Error("Video URI is required");
    }

    const storage = getStorage();
    const db = getFirestore();

    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();
    const timestamp = Date.now();
    const videoExtension = videoUri.split(".").pop() || "mp4";
    const thumbnailExtension = thumbnailUri?.split(".").pop() || "jpg";

    const videoFilename = `reel_${timestamp}.${videoExtension}`;
    const videoStoragePath = `users/${currentUser.uid}/reels/${videoFilename}`;
    const videoStorageRef = ref(storage, videoStoragePath);

    await putFile(videoStorageRef, videoUri);
    const videoDownloadURL = await getDownloadURL(videoStorageRef);

    let thumbnailDownloadURL: string | undefined;

    if (thumbnailUri) {
      const thumbnailFilename = `thumbnail_${timestamp}.${thumbnailExtension}`;
      const thumbnailStoragePath = `users/${currentUser.uid}/reels/${thumbnailFilename}`;
      const thumbnailStorageRef = ref(storage, thumbnailStoragePath);

      await putFile(thumbnailStorageRef, thumbnailUri);
      thumbnailDownloadURL = await getDownloadURL(thumbnailStorageRef);
    }

    const reelsRef = collection(db, "reels");
    const newReel = {
      userId: currentUser.uid,
      username: userData?.name || "User",
      userPhoto: userData?.photo || "",
      videoUrl: videoDownloadURL,
      thumbnailUrl: thumbnailDownloadURL,
      visibility: "public",
      status: "approved",
      caption: caption?.trim() || "",
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(reelsRef, newReel);

    const userReelData = {
      id: docRef.id,
      videoUrl: videoDownloadURL,
      thumbnailUrl: thumbnailDownloadURL,
      caption: caption?.trim() || "",
      visibility: "public",
      status: "approved",
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Get current user data to see existing reels
    const currentUserDoc = await getDoc(userRef);
    const currentUserData = currentUserDoc.data();
    const existingReels = currentUserData?.reels || [];

    // Add new reel to the array
    const updatedReels = [...existingReels, userReelData];

    await updateDoc(userRef, {
      reels: updatedReels,
    });

    return docRef.id;
  } catch (error: any) {
    console.error("Error uploading reel:", error);

    if (error.code === "storage/unauthorized") {
      throw new Error("Upload unauthorized. Please check your authentication.");
    } else if (error.code === "storage/canceled") {
      throw new Error("Upload was canceled.");
    } else if (error.code === "storage/unknown") {
      throw new Error("Unknown storage error occurred.");
    } else if (error.message?.includes("RejectedExecutionException")) {
      throw new Error("Upload service is busy. Please try again.");
    }

    throw new Error(
      `Failed to upload reel: ${error.message || "Unknown error"}`
    );
  }
};

const deleteReelWithFiles = async (
  reelId: string,
  userId: string
): Promise<void> => {
  try {
    if (!reelId || !userId) {
      throw new Error("Reel ID and User ID are required");
    }

    const db = getFirestore();
    const storage = getStorage();
    const reelRef = doc(db, "reels", reelId);
    const userRef = doc(db, "users", userId);

    const reelDoc = await getDoc(reelRef);
    if (!reelDoc.exists()) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    if (reelData?.userId !== userId) {
      throw new Error("Unauthorized: User can only delete their own reels");
    }

    // Delete video file from storage
    if (reelData.videoUrl) {
      try {
        // Extract storage path from download URL
        const videoUrl = new URL(reelData.videoUrl);
        const videoPath = decodeURIComponent(
          videoUrl.pathname.split("/o/")[1]?.split("?")[0] || ""
        );
        const videoRef = ref(storage, videoPath);
        await deleteObject(videoRef);
      } catch (storageError) {
        console.warn("Could not delete video file from storage:", storageError);
      }
    }

    // Delete thumbnail file from storage
    if (reelData.thumbnailUrl) {
      try {
        // Extract storage path from download URL
        const thumbnailUrl = new URL(reelData.thumbnailUrl);
        const thumbnailPath = decodeURIComponent(
          thumbnailUrl.pathname.split("/o/")[1]?.split("?")[0] || ""
        );
        const thumbnailRef = ref(storage, thumbnailPath);
        await deleteObject(thumbnailRef);
      } catch (storageError) {
        console.warn(
          "Could not delete thumbnail file from storage:",
          storageError
        );
      }
    }

    // Delete from reels collection
    await deleteDoc(reelRef);

    // Remove reel from user's reels array
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userReels = userData?.reels || [];

      const updatedUserReels = userReels.filter(
        (userReel: any) => userReel.id !== reelId
      );

      await updateDoc(userRef, {
        reels: updatedUserReels,
      });
    }
  } catch (error) {
    console.error("Error deleting reel with files:", error);
    throw error;
  }
};

const updateReel = async (
  reelId: string,
  userId: string,
  updates: {
    caption?: string;
    visibility?: "public" | "private";
    status?: "approved" | "pending" | "rejected";
  }
): Promise<void> => {
  try {
    if (!reelId || !userId) {
      throw new Error("Reel ID and User ID are required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    const db = getFirestore();
    const reelRef = doc(db, "reels", reelId);

    const reelDoc = await getDoc(reelRef);
    if (!reelDoc.exists()) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    if (reelData?.userId !== userId) {
      throw new Error("Unauthorized: User can only update their own reels");
    }

    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (updates.caption !== undefined) {
      updateData.caption = updates.caption.trim();
    }

    if (updates.visibility !== undefined) {
      if (!["public", "private"].includes(updates.visibility)) {
        throw new Error("Visibility must be either 'public' or 'private'");
      }
      updateData.visibility = updates.visibility;
    }

    if (updates.status !== undefined) {
      if (!["approved", "pending", "rejected"].includes(updates.status)) {
        throw new Error(
          "Status must be either 'approved', 'pending', or 'rejected'"
        );
      }
      updateData.status = updates.status;
    }

    await updateDoc(reelRef, updateData);

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userReels = userData?.reels || [];

      const updatedUserReels = userReels.map((userReel: any) => {
        if (userReel.id === reelId) {
          return {
            ...userReel,
            ...updateData,
            updatedAt: new Date(),
          };
        }
        return userReel;
      });

      await updateDoc(userRef, {
        reels: updatedUserReels,
      });
    }
  } catch (error) {
    console.error("Error updating reel:", error);
    throw error;
  }
};

export {
  addCommentToReel,
  deleteReelWithFiles,
  fetchUserReels,
  likeDislikeReel,
  listenToReelComments,
  updateReel,
  uploadReel,
};
