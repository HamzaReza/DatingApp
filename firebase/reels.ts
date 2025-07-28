import { getAuth } from "@react-native-firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
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

// Types for reel data
export interface Reel {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  likes: string[]; // Array of user IDs who liked the reel
  dislikes: string[]; // Array of user IDs who disliked the reel
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

export const fetchUserReels = (
  callback: (reels: Reel[]) => void
): (() => void) => {
  try {
    const db = getFirestore();
    const reelsRef = collection(db, "reels");

    // Query reels ordered by creation date (newest first)
    const q = query(reelsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const reels: Reel[] = [];

        snapshot.forEach(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();
            const reel: Reel = {
              id: doc.id,
              userId: data.userId,
              username: data.username,
              userPhoto: data.userPhoto,
              videoUrl: data.videoUrl,
              thumbnailUrl: data.thumbnailUrl,
              caption: data.caption,
              likes: data.likes || [],
              dislikes: data.dislikes || [],
              comments: data.comments || [],
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
            reels.push(reel);
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

export const likeDislikeReel = async (
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

    // Get current reel data
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
      // Remove from dislikes if user previously disliked
      if (currentDislikes.includes(userId)) {
        updatedDislikes = currentDislikes.filter((id: string) => id !== userId);
      }

      // Toggle like
      if (currentLikes.includes(userId)) {
        updatedLikes = currentLikes.filter((id: string) => id !== userId);
      } else {
        updatedLikes.push(userId);
      }
    } else if (action === "dislike") {
      // Remove from likes if user previously liked
      if (currentLikes.includes(userId)) {
        updatedLikes = currentLikes.filter((id: string) => id !== userId);
      }

      // Toggle dislike
      if (currentDislikes.includes(userId)) {
        updatedDislikes = currentDislikes.filter((id: string) => id !== userId);
      } else {
        updatedDislikes.push(userId);
      }
    }

    // Update the reel in the main reels collection
    await updateDoc(reelRef, {
      likes: updatedLikes,
      dislikes: updatedDislikes,
      updatedAt: serverTimestamp(),
    });

    // Also update the reel in the user's profile document
    if (reelOwnerId) {
      const userRef = doc(db, "users", reelOwnerId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userReels = userData?.reels || [];

        // Find and update the specific reel in user's reels array
        const updatedUserReels = userReels.map((userReel: any) => {
          if (userReel.reelId === reelId) {
            return {
              ...userReel,
              likes: updatedLikes.length,
              dislikes: updatedDislikes.length,
            };
          }
          return userReel;
        });

        // Update the user's profile with the updated reels array
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

export const addCommentToReel = async (
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

    // Check if reel exists
    const reelDoc = await getDoc(reelRef);
    if (!reelDoc.exists()) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    const reelOwnerId = reelData?.userId;

    // Get current user data
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();

    // Create new comment
    const newComment: ReelComment = {
      id: `${Date.now()}_${currentUser.uid}`, // Simple ID generation
      userId: currentUser.uid,
      username: userData?.name || "User",
      userPhoto: userData?.photo || "",
      content: content.trim(),
      createdAt: new Date(),
    };

    // Add comment to reel in the main reels collection
    await updateDoc(reelRef, {
      comments: arrayUnion(newComment),
      updatedAt: serverTimestamp(),
    });

    // Also add comment to the reel in the user's profile document
    if (reelOwnerId) {
      const reelOwnerRef = doc(db, "users", reelOwnerId);
      const reelOwnerDoc = await getDoc(reelOwnerRef);

      if (reelOwnerDoc.exists()) {
        const reelOwnerData = reelOwnerDoc.data();
        const userReels = reelOwnerData?.reels || [];

        // Find and update the specific reel in user's reels array
        const updatedUserReels = userReels.map((userReel: any) => {
          if (userReel.reelId === reelId) {
            const currentComments = userReel.comments || [];
            return {
              ...userReel,
              comments: [...currentComments, newComment],
            };
          }
          return userReel;
        });

        // Update the user's profile with the updated reels array
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

// Real-time listener for comments on a specific reel
export const listenToReelComments = (
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

export const uploadReel = async (
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

    // Check if Firebase Storage is properly initialized
    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    // Get user data for the reel
    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();
    const timestamp = Date.now();
    const videoExtension = videoUri.split(".").pop() || "mp4";
    const thumbnailExtension = thumbnailUri?.split(".").pop() || "jpg";

    // Upload video file
    const videoFilename = `reel_${timestamp}.${videoExtension}`;
    const videoStoragePath = `users/${currentUser.uid}/reels/${videoFilename}`;
    const videoStorageRef = ref(storage, videoStoragePath);

    await putFile(videoStorageRef, videoUri);
    const videoDownloadURL = await getDownloadURL(videoStorageRef);

    // Upload thumbnail if provided, otherwise use a default or generate one
    let thumbnailDownloadURL: string | undefined;

    if (thumbnailUri) {
      const thumbnailFilename = `thumbnail_${timestamp}.${thumbnailExtension}`;
      const thumbnailStoragePath = `users/${currentUser.uid}/reels/${thumbnailFilename}`;
      const thumbnailStorageRef = ref(storage, thumbnailStoragePath);

      await putFile(thumbnailStorageRef, thumbnailUri);
      thumbnailDownloadURL = await getDownloadURL(thumbnailStorageRef);
    }

    // Create reel document in Firestore
    const reelsRef = collection(db, "reels");
    const newReel = {
      userId: currentUser.uid,
      username: userData?.name || "User",
      userPhoto: userData?.photo || "",
      videoUrl: videoDownloadURL,
      thumbnailUrl: thumbnailDownloadURL,
      caption: caption?.trim() || "",
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(reelsRef, newReel);

    // Also add reel to user's profile document (maintaining existing structure)
    const userReelData = {
      reelUrl: videoDownloadURL,
      thumbnailUrl: thumbnailDownloadURL,
      visibility: "public", // or "private" based on your needs
      status: "approved",
      likes: 0,
      dislikes: 0,
      comments: [],
      createdAt: new Date(),
      reelId: docRef.id, // Store the reel document ID for reference
    };

    // Update user's profile with the new reel
    await updateDoc(userRef, {
      reels: arrayUnion(userReelData),
    });

    return docRef.id;
  } catch (error: any) {
    console.error("Error uploading reel:", error);

    // Handle specific Firebase errors
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

/**
 * Delete a reel and its associated files from storage
 * @param reelId - ID of the reel to delete
 * @param userId - ID of the user attempting to delete (for authorization)
 * @returns Promise<void>
 */
export const deleteReelWithFiles = async (
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

    // Check if reel exists and user owns it
    const reelDoc = await reelRef.get();
    if (!reelDoc.exists) {
      throw new Error("Reel not found");
    }

    const reelData = reelDoc.data();
    if (reelData?.userId !== userId) {
      throw new Error("Unauthorized: User can only delete their own reels");
    }

    // Delete video file from storage
    if (reelData.videoUrl) {
      try {
        const videoRef = ref(storage, reelData.videoUrl);
        await deleteObject(videoRef);
      } catch (storageError) {
        console.warn("Could not delete video file from storage:", storageError);
      }
    }

    // Delete thumbnail file from storage
    if (reelData.thumbnailUrl) {
      try {
        const thumbnailRef = ref(storage, reelData.thumbnailUrl);
        await deleteObject(thumbnailRef);
      } catch (storageError) {
        console.warn(
          "Could not delete thumbnail file from storage:",
          storageError
        );
      }
    }

    // Delete the reel document
    await reelRef.delete();
  } catch (error) {
    console.error("Error deleting reel with files:", error);
    throw error;
  }
};
