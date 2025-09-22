import { deleteImage, uploadImage } from "@/firebase/auth";
import { sendInAppNotification } from "@/helpers/notificationHelper";
import { sendPushNotification } from "@/utils/sendPushNotification";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "@react-native-firebase/firestore";
import { verifyFaceMatch } from "./faceVerification";

export interface GalleryImage {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  imageUrl: string;
  visibility: "public" | "private";
  status: "approved" | "pending" | "rejected";
  likes: string[];
  dislikes: string[];
  createdAt: Date | string | FirebaseFirestoreTypes.Timestamp;
  updatedAt: Date | string | FirebaseFirestoreTypes.Timestamp;
}

const fetchUserGallery = (
  callback: (images: GalleryImage[]) => void
): (() => void) => {
  try {
    const db = getFirestore();
    const galleryRef = collection(db, "gallery");

    const q = query(galleryRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const images: GalleryImage[] = [];

        snapshot.forEach(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();

            // Filter for public visibility in the client side
            if (data.visibility === "public" && data.status === "approved") {
              const image: GalleryImage = {
                id: doc.id,
                userId: data.userId,
                username: data.username,
                userPhoto: data.userPhoto,
                imageUrl: data.imageUrl,
                visibility: data.visibility || "public",
                status: data.status || "approved",
                likes: data.likes || [],
                dislikes: data.dislikes || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              };
              images.push(image);
            }
          }
        );

        callback(images);
      },
      error => {
        console.error("Error in fetchUserGallery listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up fetchUserGallery listener:", error);
    throw error;
  }
};

const likeDislikeImage = async (
  imageId: string,
  userId: string,
  action: "like" | "dislike"
): Promise<void> => {
  try {
    if (!imageId || !userId) {
      throw new Error("Image ID and User ID are required");
    }

    const db = getFirestore();
    const imageRef = doc(db, "gallery", imageId);

    const imageDoc = await getDoc(imageRef);
    if (!imageDoc.exists()) {
      throw new Error("Image not found");
    }

    const imageData = imageDoc.data();
    const currentLikes = imageData?.likes || [];
    const currentDislikes = imageData?.dislikes || [];
    const imageOwnerId = imageData?.userId;

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

    // Check if dislikes exceed threshold and update status to 'rejected'
    const shouldReject = updatedDislikes.length >= 2;
    const updateData: any = {
      likes: updatedLikes,
      dislikes: updatedDislikes,
      updatedAt: serverTimestamp(),
    };

    if (shouldReject) {
      updateData.status = "rejected";
    }

    await updateDoc(imageRef, updateData);

    // Send notification if image is rejected
    if (shouldReject && imageOwnerId) {
      try {
        await sendInAppNotification({
          toUserId: imageOwnerId,
          title: "Image Rejected",
          subtitle:
            "Your image has been rejected due to community feedback. It received too many dislikes.",
          type: "custom",
          data: {
            id: imageOwnerId,
            imageId: imageId,
            action: "image_rejected",
            image: imageData?.imageUrl || "",
          },
        });
        await sendPushNotification({
          toUserId: [imageOwnerId],
          title: "Image Rejected",
          subtitle:
            "Your image has been rejected due to community feedback. It received too many dislikes.",
          data: {
            id: imageOwnerId,
            imageId: imageId,
            type: "custom",
            image: imageData?.imageUrl || "",
          },
        });
      } catch (notificationError) {
        console.error(
          "Error sending rejection notification:",
          notificationError
        );
      }
    }

    if (imageOwnerId) {
      const userRef = doc(db, "users", imageOwnerId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userGallery = userData?.gallery || [];

        const updatedUserGallery = userGallery.map((userImage: any) => {
          if (userImage.id === imageId) {
            const userImageUpdate: any = {
              ...userImage,
              likes: updatedLikes,
              dislikes: updatedDislikes,
            };

            if (shouldReject) {
              userImageUpdate.status = "rejected";
            }

            return userImageUpdate;
          }
          return userImage;
        });

        await updateDoc(userRef, {
          gallery: updatedUserGallery,
        });
      }
    }
  } catch (error) {
    console.error(`Error ${action}ing image:`, error);
    throw error;
  }
};

const uploadGalleryImage = async (
  imageUris: string[],
  user: FirebaseAuthTypes.User,
  visibility: "public" | "private" = "public"
): Promise<string[]> => {
  try {
    if (!user?.uid) {
      throw new Error("User must be authenticated to upload images");
    }

    if (!imageUris || imageUris.length === 0) {
      throw new Error("Image URIs are required");
    }

    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data();

    // Verify faces before uploading
    const verifiedImageUris: string[] = [];

    for (const imageUri of imageUris) {
      try {
        // Upload image first
        const imageUrl = await uploadImage(
          imageUri,
          "user",
          user.uid,
          "gallery"
        );

        // Verify face matches profile
        if (userData?.photo) {
          const verificationResult = await verifyFaceMatch(
            user.uid,
            imageUrl,
            userData.photo
          );

          if (!verificationResult.isMatch) {
            // Delete the uploaded image if verification fails
            await deleteImage(imageUrl);
            throw new Error(
              verificationResult.error ||
                "Face verification failed. Please upload an image that clearly shows your face and matches your profile picture."
            );
          }
        }

        verifiedImageUris.push(imageUrl);
      } catch (error: any) {
        console.error(`Face verification failed for image ${imageUri}:`, error);
        throw error;
      }
    }

    const imageDownloadURLs = verifiedImageUris;

    // Use a transaction to ensure all images are added atomically
    const imageIds: string[] = [];

    await runTransaction(db, async transaction => {
      const userDocSnapshot = await transaction.get(userRef);
      if (!userDocSnapshot.exists()) {
        throw new Error("User data not found during transaction");
      }

      const currentUserData = userDocSnapshot.data();
      const existingGallery = currentUserData?.gallery || [];

      // Create gallery documents and prepare user data updates
      for (let i = 0; i < imageDownloadURLs.length; i++) {
        const imageDownloadURL = imageDownloadURLs[i];

        const newImage = {
          userId: user.uid,
          username: userData?.name || "User",
          userPhoto: userData?.photo || "",
          imageUrl: imageDownloadURL,
          visibility: visibility,
          status: "approved",
          likes: [],
          dislikes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const galleryRef = collection(db, "gallery");
        const docRef = await addDoc(galleryRef, newImage);
        imageIds.push(docRef.id);

        const userImageData = {
          id: docRef.id,
          imageUrl: imageDownloadURL,
          visibility: visibility,
          status: "approved",
          likes: [],
          dislikes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add to existing gallery array
        existingGallery.push(userImageData);
      }

      // Update user document with all new images
      transaction.update(userRef, {
        gallery: existingGallery,
      });
    });

    return imageIds;
  } catch (error: any) {
    console.error("Error uploading multiple gallery images:", error);
    throw new Error(
      `Failed to upload images: ${error.message || "Unknown error"}`
    );
  }
};

const deleteGalleryImageWithFile = async (
  imageId: string,
  userId: string
): Promise<void> => {
  try {
    if (!imageId || !userId) {
      throw new Error("Image ID and User ID are required");
    }

    const db = getFirestore();
    const imageRef = doc(db, "gallery", imageId);
    const userRef = doc(db, "users", userId);

    const imageDoc = await getDoc(imageRef);
    if (!imageDoc.exists()) {
      throw new Error("Image not found");
    }

    const imageData = imageDoc.data();
    if (imageData?.userId !== userId) {
      throw new Error("Unauthorized: User can only delete their own images");
    }

    // Note: Storage deletion is handled by the existing deleteImage function in auth.ts
    // when needed. For now, we'll just delete the document and update user data.

    // Delete from gallery collection
    await deleteDoc(imageRef);

    // Remove image from user's gallery array
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userGallery = userData?.gallery || [];

      const updatedUserGallery = userGallery.filter(
        (userImage: any) => userImage.id !== imageId
      );

      await updateDoc(userRef, {
        gallery: updatedUserGallery,
      });
    }
  } catch (error) {
    console.error("Error deleting gallery image with file:", error);
    throw error;
  }
};

const updateGalleryImage = async (
  imageId: string,
  userId: string,
  updates: {
    visibility?: "public" | "private";
    status?: "approved" | "pending" | "rejected";
  }
): Promise<void> => {
  try {
    if (!imageId || !userId) {
      throw new Error("Image ID and User ID are required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    const db = getFirestore();
    const imageRef = doc(db, "gallery", imageId);

    const imageDoc = await getDoc(imageRef);
    if (!imageDoc.exists()) {
      throw new Error("Image not found");
    }

    const imageData = imageDoc.data();
    if (imageData?.userId !== userId) {
      throw new Error("Unauthorized: User can only update their own images");
    }

    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

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

    await updateDoc(imageRef, updateData);

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userGallery = userData?.gallery || [];

      const updatedUserGallery = userGallery.map((userImage: any) => {
        if (userImage.id === imageId) {
          return {
            ...userImage,
            ...updateData,
            updatedAt: new Date(),
          };
        }
        return userImage;
      });

      await updateDoc(userRef, {
        gallery: updatedUserGallery,
      });
    }
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw error;
  }
};

export {
  deleteGalleryImageWithFile,
  fetchUserGallery,
  likeDislikeImage,
  updateGalleryImage,
  uploadGalleryImage,
};
