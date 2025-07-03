import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
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

const auth = getAuth();

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

// Verify OTP
const verifyCode = async (confirmation: any, code: string) => {
  try {
    await confirmation.confirm(code);
    console.log("Phone authentication successful");
  } catch (error: any) {
    console.log(error);
    console.log("Invalid OTP");
  }
};

// Save user data to Firestore
const saveUserToDatabase = async (
  userId: string,
  userData: { phoneNumber: string }
) => {
  try {
    const db = getFirestore();
    await addDoc(collection(db, "users"), {
      ...userData,
      uid: userId,
      createdAt: new Date(),
      isProfileComplete: false,
      updatedAt: new Date(),
    });

    console.log("User data saved to Firestore successfully");
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

    console.log("User data updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(`Failed to update user data: ${error.message}`);
  }
};

// Get user data by UID
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

export {
  authenticateWithPhone,
  getUserByUid,
  saveUserToDatabase,
  updateUser,
  verifyCode,
};
