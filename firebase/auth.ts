import getDistanceFromLatLonInMeters from "@/utils/Distance";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import {
  collection,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
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

const signInWithGoogleFirebase = async () => {
  try {
    GoogleSignin.configure({
      webClientId:
        "949979854608-nvfh2ig0kp6mc4t7742mo813pkosjfbg.apps.googleusercontent.com",
    });
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const { idToken } = response.data;

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      const existingUser = await getUserByEmail(user.email || "");

      if (!existingUser) {
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

const verifyCode = async (confirmation: any, code: string) => {
  try {
    await confirmation.confirm(code);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const saveUserToDatabase = async (userId: string, userData: any) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
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

const updateUser = async (userId: string, updateData: any) => {
  try {
    const db = getFirestore();

    const userRef = doc(db, "users", userId);
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

const getUserByEmail = async (email: string) => {
  try {
    const db = getFirestore();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

const getUserByUid = async (userId: string) => {
  try {
    const db = getFirestore();

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

const uploadImage = async (
  imageUri: string,
  type: "user" | "event" | "creator" | "story",
  userId?: string,
  imageType?: "profile" | "gallery"
): Promise<string> => {
  try {
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

const uploadMultipleImages = async (
  imageUris: string[],
  type: "user" | "event" | "creator" | "story",
  userId?: string,
  imageType?: "profile" | "gallery"
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

const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
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

const getCurrentAuth = async () => {
  return getAuth();
};

const fetchAllUsers = async () => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);

    const users = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = doc.data();

        let createdAt: Date = new Date(0); // default very old date

        if (data.createdAt instanceof Timestamp) {
          createdAt = data.createdAt.toDate();
        } else if (
          typeof data.createdAt === "string" ||
          typeof data.createdAt === "number"
        ) {
          createdAt = new Date(data.createdAt);
        }

        return {
          id: doc.id,
          ...data,
          isNew: createdAt > threeDaysAgo,
        };
      }
    );

    return users;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
};

export const fetchUsersWithLocation = async () => {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  return snapshot.docs.map(
    (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const data = doc.data();
      const interestsArray = data.interests?.split(",") || [];

      return {
        id: doc.id,
        name: data.name,
        photo: data.photo,
        location: data.location, // GeoPoint
        interests: interestsArray,
      };
    }
  );
};

const fetchAllUserStories = async () => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const [usersSnapshot, storiesSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "stories")),
    ]);

    const usersData = usersSnapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: doc.id,
        username: doc.data().name || "User",
        profilePic: doc.data().photo || "https://example.com/default.jpg",
        isOwn: doc.id === userId,
      })
    );

    const storiesByUser: Record<string, any[]> = {};
    storiesSnapshot.forEach(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        storiesByUser[doc.id] = (doc.data().storyItems || [])
          .map((story: any) => ({
            ...story,
            date: story.date?.toDate() || new Date(),
          }))
          .sort((a: any, b: any) => b.date - a.date);
      }
    );

    return usersData
      .map((user: any) => {
        const userStories = storiesByUser[user.id] || [];

        return {
          ...user,
          hasStories: userStories.length > 0,
          image: user.isOwn
            ? userStories[0]?.storyUrls[0] || user.profilePic
            : userStories[0]?.storyUrls[0] || null,
          storyCount: userStories.length,
        };
      })
      .filter((user: any) => user.isOwn || user.image !== null)
      .sort((a: any, b: any) => b.isOwn - a.isOwn);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
};

const fetchStoriesForUser = async (userId: string) => {
  const db = getFirestore();
  const docSnap = await getDoc(doc(db, "stories", userId));

  if (docSnap.exists()) {
    return docSnap.data()?.storyItems || [];
  } else {
    return []; // No stories for this user
  }
};

const fetchNextUsersStories = async (currentUserId: string) => {
  const db = getFirestore();

  const snapshot = await getDocs(collection(db, "stories"));

  const allUsers = snapshot.docs
    .filter(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        doc.id !== currentUserId
    ) 
    .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
      userId: doc.id,
      ...doc.data(),
    }));

  return allUsers;
};


const getUserLocation = async (userId: string) => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, "users", userId);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data()?.location || null;  // assuming location is a field in user doc
    } else {
      console.log("No location data found!");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user location:", error);
    return null;
  }
};

export const getNearbyUsers = async (currentUserLocation) => {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const nearbyUsers: any[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const userLocation = data.location;

    if (userLocation?.latitude && userLocation?.longitude) {
      const distance = getDistanceFromLatLonInMeters(
        currentUserLocation.latitude,
        currentUserLocation.longitude,
        userLocation.latitude,
        userLocation.longitude
      );

      if (distance <= 10) {
        nearbyUsers.push({
          id: doc.id,
          ...data,
        });
      }
    }
  });

  return nearbyUsers;
};

 const handleStoryUpload = async (story: Story,pickStory,user) => {
    console.log("hi");
    const result = await pickStory;

    if (!result || result.length === 0) return;

    const uploadedUrls = await uploadMultipleImages(result, "story");

    const now = new Date();

    const newStoryItems = uploadedUrls.map(url => ({
      url,
      createdAt: now,
    }));

    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User not found");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    const existingStories = userData?.stories || [];

    const updatedStories = [...existingStories, ...newStoryItems];

    await updateDoc(userRef, {
      stories: updatedStories,
      updatedAt: new Date(),
    });

    const storyRef = doc(db, "stories", user.uid);
    const storyDoc = await getDoc(storyRef);

    const newStoryItem = {
      date: now,
      storyUrls: uploadedUrls,
    };

    if (storyDoc.exists()) {
      const existingData = storyDoc.data();
      const existingStories = existingData?.storyItems || [];

      const updatedStories = [...existingStories, newStoryItem];

      await setDoc(storyRef, {
        storyItems: updatedStories,
      });
    } else {
      await setDoc(storyRef, {
        storyItems: [newStoryItem],
      });
    }

    console.log("✅ Story added");
  };

// New functions for swipe profile functionality

const getRandomUser = async (currentUserId: string, excludeUserIds: string[] = []) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const availableUsers = snapshot.docs
      .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user: any) => 
        user.id !== currentUserId && 
        !excludeUserIds.includes(user.id) &&
        user.isProfileComplete === true
      );

    if (availableUsers.length === 0) {
      return null;
    }

    // Get a random user
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    return availableUsers[randomIndex];
  } catch (error) {
    console.error("Error fetching random user:", error);
    throw error;
  }
};

const recordLike = async (currentUserId: string, likedUserId: string) => {
  try {
    const db = getFirestore();
    
    // Add to current user's likes
    const currentUserLikesRef = doc(db, "users", currentUserId, "likes", likedUserId);
    await setDoc(currentUserLikesRef, {
      likedAt: new Date(),
      userId: likedUserId,
    });

    // Check if it's a match
    const isMatch = await checkForMatch(currentUserId, likedUserId);
    
    return { isMatch };
  } catch (error) {
    console.error("Error recording like:", error);
    throw error;
  }
};

const checkForMatch = async (currentUserId: string, likedUserId: string) => {
  try {
    const db = getFirestore();
    
    // Check if the liked user has also liked the current user
    const likedUserLikesRef = doc(db, "users", likedUserId, "likes", currentUserId);
    const likedUserLikeDoc = await getDoc(likedUserLikesRef);
    
    if (likedUserLikeDoc.exists()) {
      // It's a match! Create a match record
      const matchRef = doc(db, "matches", `${currentUserId}_${likedUserId}`);
      await setDoc(matchRef, {
        users: [currentUserId, likedUserId],
        matchedAt: new Date(),
        isActive: true,
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for match:", error);
    throw error;
  }
};

const getNextUserForSwipe = async (currentUserId: string, excludeUserIds: string[] = []) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    // Get users that haven't been liked by current user
    const currentUserLikesRef = collection(db, "users", currentUserId, "likes");
    const likesSnapshot = await getDocs(currentUserLikesRef);
    const likedUserIds = likesSnapshot.docs.map(doc => doc.id);

    const availableUsers = snapshot.docs
      .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user: any) => 
        user.id !== currentUserId && 
        !excludeUserIds.includes(user.id) &&
        !likedUserIds.includes(user.id) &&
        user.isProfileComplete === true
      );

    if (availableUsers.length === 0) {
      return null;
    }

    // Get a random user
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    return availableUsers[randomIndex];
  } catch (error) {
    console.error("Error fetching next user for swipe:", error);
    throw error;
  }
};

export {
  authenticateWithPhone, checkForMatch, deleteImage,
  fetchAllUsers,
  fetchAllUserStories,
  fetchNextUsersStories,
  fetchStoriesForUser,
  getCurrentAuth, getNextUserForSwipe, getRandomUser, getUserByEmail,
  getUserByUid, getUserLocation,
  handleStoryUpload, recordLike, saveUserToDatabase,
  signInWithGoogleFirebase,
  updateUser,
  uploadImage,
  uploadMultipleImages,
  verifyCode
};

