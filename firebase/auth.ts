import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  putFile,
  ref,
} from "@react-native-firebase/storage";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

const auth = getAuth();
const storage = getStorage();

// Authenticate with phone number (handles both signup and login)
const authenticateWithPhone = async (phoneNumber: string) => {
  if (!phoneNumber || !phoneNumber.startsWith("+")) {
    throw new Error("Phone number must be in E.164 format (e.g., +1234567890)");
  }

  try {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
    return confirmation;
  } catch (error: any) {
    if (error.code === "auth/invalid-phone-number") {
      throw new Error("Invalid phone number format");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many requests. Please try again later.");
    } else if (error.code === "auth/quota-exceeded") {
      throw new Error("SMS quota exceeded. Please try again later.");
    } else if (error.code === "auth/internal-error") {
      throw new Error(
        "Authentication service error. Please check your phone number and try again."
      );
    } else {
      throw new Error(
        `Authentication failed: ${error.message || "Unknown error"}`
      );
    }
  }
};

// Sign in with Google and Firebase (using social.ts approach + Firebase integration)
const signInWithGoogleFirebase = async () => {
  try {
    // Use the clean Google Sign-In approach from social.ts
    GoogleSignin.configure({
      webClientId:
        "949979854608-nvfh2ig0kp6mc4t7742mo813pkosjfbg.apps.googleusercontent.com",
    });
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      // Get the ID token from Google (from social.ts approach)
      const { idToken } = response.data;

      // Now integrate with Firebase
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const existingUser = await getUserByEmail(user.email || "");

      if (!existingUser) {
        // Save new user to Firestore
        await saveUserToDatabase(user.uid, {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          provider: "google",
        });
      } else {
        await updateUser(existingUser.uid, {
          provider: "google",
        });
      }

      return {
        success: true,
        user: existingUser || {
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          provider: "google",
        },
        isNewUser: !existingUser,
      };
    } else {
      return {
        success: false,
        error: "Sign in was cancelled by user",
      };
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      return {
        success: false,
        error: error.message || "Google sign in failed",
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};

// Verify OTP
const verifyCode = async (confirmation: any, code: string) => {
  try {
    await confirmation.confirm(code);
  } catch (error: any) {
    console.error(error);
  }
};

// Save user data to Firestore
const saveUserToDatabase = async (userId: string, userData: any) => {
  try {
    const db = getFirestore();
    await addDoc(collection(db, "users"), {
      ...userData,
      uid: userId,
      createdAt: new Date(),
      isProfileComplete: false,
      updatedAt: new Date(),
    });

    return true;
  } catch (error: any) {
    console.error("Error saving user to database:", error);
    throw new Error(`Failed to save user data: ${error.message}`);
  }
};

// Update user data in Firestore
const updateUser = async (userId: string, updateData: any) => {
  try {
    const db = getFirestore();

    // First, find the user document by uid
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    // Get the first (and should be only) document
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    // Update the document with new data and updated timestamp
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    return true;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(`Failed to update user data: ${error.message}`);
  }
};

// Get user data by email
const getUserByEmail = async (email: string) => {
  try {
    const db = getFirestore();

    // Find the user document by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // User doesn't exist
    }

    // Return the user data
    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

// Get user data by UID (for phone authentication)
const getUserByUid = async (userId: string) => {
  try {
    const db = getFirestore();

    // Find the user document by uid
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // User doesn't exist
    }

    // Return the user data
    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

// Upload image to Firebase Storage and return download URL
const uploadImage = async (
  imageUri: string,
  type: "user" | "event" | "creator",
  userId?: string,
  imageType?: "profile" | "gallery"
): Promise<string> => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}.jpg`;

    const storagePath =
      type === "user"
        ? `users/${userId}/${imageType}/${filename}`
        : `${type}/${filename}`;

    const storageRef = ref(storage, storagePath);

    await putFile(storageRef, imageUri);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Upload multiple images and return array of download URLs
const uploadMultipleImages = async (
  imageUris: string[],
  type: "user" | "event" | "creator",
  userId: string,
  imageType: "profile" | "gallery" = "gallery"
): Promise<string[]> => {
  try {
    const uploadPromises = imageUris.map(uri =>
      uploadImage(uri, type, userId, imageType)
    );

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error: any) {
    console.error("Error uploading multiple images:", error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

// Delete image from Firebase Storage
const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(
      url.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (!path) {
      throw new Error("Invalid image URL format");
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.error("Error deleting image:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

const getCurrentAuth = () => {
  return getAuth();
};

export {
  authenticateWithPhone,
  deleteImage,
  getCurrentAuth,
  getUserByEmail,
  getUserByUid,
  saveUserToDatabase,
  signInWithGoogleFirebase,
  updateUser,
  uploadImage,
  uploadMultipleImages,
  verifyCode,
};
