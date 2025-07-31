import { addViewedUser, resetViewedUsers } from "@/redux/slices/swipeSlice";
import { store } from "@/redux/store";
import getDistanceFromLatLonInMeters from "@/utils/Distance";
import { calculateMatchScore } from "@/utils/MatchScore";
import {
  FirebaseAuthTypes,
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
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "@react-native-firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  putFile,
  ref,
} from "@react-native-firebase/storage";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

interface Location {
  latitude: number;
  longitude: number;
}

interface Story {
  url: string;
  createdAt: Date;
}

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  name?: string;
  photo?: string;
  location?: Location;
  interests?: string[];
  stories?: Story[];
  createdAt?: Date;
  updatedAt?: Date;
  isProfileComplete?: boolean;
}

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
  console.log("🚀 ~ auth.ts:186 ~ updateUser ~ userId:", userId);
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

const getUserByUid = (
  userId: string,
  callback?: (userData: any) => void
): (() => void) => {
  try {
    if (!userId) {
      console.error("User ID is required for getting user data");
      return () => {};
    }

    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          if (callback) {
            callback(userData);
          }
        } else {
          if (callback) {
            callback(null);
          }
        }
      },
      error => {
        console.error("Error in getUserByUid listener:", error);
        if (callback) {
          callback(null);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up getUserByUid listener:", error);
    return () => {};
  }
};

const getUserByUidAsync = async (userId: string) => {
  try {
    if (!userId) {
      console.error("User ID is required for getting user data");
      return null;
    }

    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting user data:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

const getUserByPhoneNumber = async (phoneNumber: string) => {
  try {
    const db = getFirestore();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data by phone number:", error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

const checkUserExistsForSignup = async (phoneNumber: string) => {
  const existingUser = await getUserByPhoneNumber(phoneNumber);

  if (existingUser) {
    if (existingUser.isProfileComplete) {
      throw new Error("User already exists");
    }
  }

  return true;
};

const uploadImage = async (
  imageUri: string,
  type: "user" | "event" | "creator" | "story",
  userId?: string,
  imageType?: "profile" | "gallery" | "reel"
): Promise<string> => {
  try {
    // Check if Firebase is properly initialized
    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    const extension = imageUri.split(".").pop();

    const timestamp = Date.now();
    const filename = `${timestamp}.${extension}`;

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
      `Failed to upload image: ${error.message || "Unknown error"}`
    );
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

    const q = query(
      usersRef,
      where("isProfileComplete", "==", true),
      where("status", "==", "approved")
    );

    const snapshot = await getDocs(q);

    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);

    const users = snapshot.docs.map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = doc.data();

        let createdAt: Date = new Date(0);

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
  const q = query(
    usersRef,
    where("isProfileComplete", "==", true),
    where("status", "==", "approved")
  );
  const snapshot = await getDocs(q);

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

const fetchAllUserStories = async (userId: string) => {
  try {
    const db = getFirestore();

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
    return [];
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
      return snapshot.data()?.location || null;
    } else {
      console.log("No location data found!");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user location:", error);
    return null;
  }
};

export const getNearbyUsers = async (currentUserLocation: Location) => {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const nearbyUsers: any[] = [];

  snapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
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

export const sendGroupInvitesByTags = async (
  invitedBy: string,
  selectedTags: string[],
  maxParticipants: number,
  image: string,
  groupName: string,
  groupDescription: string,
  selectedGender: string,
  minAge: number,
  maxAge: number,
  eventDate: any
) => {
  try {
    const db = getFirestore();

    const inviterDoc = await getDoc(doc(db, "users", invitedBy));
    const inviterData = inviterDoc.data();

    if (!inviterData?.location?.latitude || !inviterData?.location?.longitude) {
      throw new Error("Inviter's location not available");
    }

    const inviterLat = inviterData.location.latitude;
    const inviterLon = inviterData.location.longitude;

    const usersSnapshot = await getDocs(collection(db, "users"));

    const matchingUsers = usersSnapshot.docs
      .filter((userDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = userDoc.data();

        // Skip inviter (already added later)
        if (userDoc.id === invitedBy) return false;

        // Location filter (within 12 km)
        const userLat = data.location?.latitude;
        const userLon = data.location?.longitude;

        if (userLat == null || userLon == null) return false;

        const distance = getDistanceFromLatLonInMeters(
          inviterLat,
          inviterLon,
          userLat,
          userLon
        );
        if (distance > 12000) return false;

        // Tag filter
        const userTags = data.interests?.split(",") || [];
        const hasMatchingTag = selectedTags.some(tag => userTags.includes(tag));

        // Gender filter
        const userGender = data.gender?.toLowerCase();
        const genderMatch =
          selectedGender === "mixed" || userGender === selectedGender;

        // Age filter
        const userAge = parseInt(data.age, 10);
        const ageMatch =
          !isNaN(userAge) && userAge >= minAge && userAge <= maxAge;

        return hasMatchingTag && genderMatch && ageMatch;
      })
      .slice(0, maxParticipants)
      .map((userDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        uid: userDoc.id,
        name: userDoc.data().name || "User",
      }));

    if (matchingUsers.length === 0) {
      throw new Error("No users found matching the selected criteria");
    }

    const inviterName = inviterData?.name || "Someone";

    const groupRef = doc(collection(db, "messages"));
    const groupId = groupRef.id;
    const invitedAt = Timestamp.now();

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(
        image,
        "groupImages",
        groupId,
        "inviteImage"
      );
    }

    await setDoc(groupRef, {
      noOfInvitors: matchingUsers.length,
      maxParticipants,
      id: groupId,
      invitedBy,
      invitedByName: inviterName,
      invitedAt,
      image: imageUrl,
      type: "group",
      tags: selectedTags,

      groupName,
      groupDescription,
      minAge,
      maxAge,
      eventDate,
      genderFilter: selectedGender,
      users: [
        {
          uid: invitedBy,
          name: inviterName,
          status: "accepted",
          invitedAt,
        },
        ...matchingUsers.map((user: { uid: string; name: string }) => ({
          uid: user.uid,
          name: user.name,
          status: "pending",
          invitedAt,
        })),
      ],
      createdAt: Timestamp.now(),
    });

    // Send notifications
    const notificationBatch = writeBatch(db);
    const now = Timestamp.now();

    for (const user of matchingUsers) {
      const notificationRef = doc(db, "notifications", user.uid);
      const notificationDoc = await getDoc(notificationRef);

      const newNotification = {
        title: groupName,
        subtitle: `${inviterName} has invited you for a hangout. Want to join?`,
        type: "messages",
        groupId,
        createdAt: now,
        tags: selectedTags,
        maxParticipants,
      };

      if (notificationDoc.exists()) {
        notificationBatch.update(notificationRef, {
          items: [...(notificationDoc.data()?.items || []), newNotification],
        });
      } else {
        notificationBatch.set(notificationRef, {
          items: [newNotification],
        });
      }
    }

    await notificationBatch.commit();

    return { success: true };
  } catch (error) {
    console.error("Error sending group invites:", error);
    return { success: false, error: (error as Error).message };
  }
};
export const getUserNotifications = async (userId: string) => {
  const db = getFirestore();
  try {
    const notificationRef = doc(db, "notifications", userId);
    const snapshot = await getDoc(notificationRef);

    if (snapshot.exists()) {
      return snapshot.data().items || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const respondToGroupInvite = async (
  groupId: string,
  userId: string,
  accept: boolean
) => {
  console.log("hello", groupId, accept);

  const db = getFirestore();
  try {
    const groupRef = doc(db, "messages", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error("Group not found");
    }

    const groupData = groupSnap.data();
    const maxParticipants = groupData.maxParticipants || 0;
    console.log(maxParticipants, "max");
    const currentUsers = groupData.users || [];

    const acceptedCount = currentUsers.filter(
      user => user.status === "accepted"
    ).length;

    if (accept && acceptedCount >= maxParticipants) {
      throw new Error("This group has already reached its participant limit.");
    }

    const updatedUsers = currentUsers.map(user => {
      if (user.uid === userId) {
        return {
          ...user,
          status: accept ? "accepted" : "rejected",
          respondedAt: new Date(),
        };
      }
      return user;
    });

    await updateDoc(groupRef, {
      users: updatedUsers,
    });

    return true;
  } catch (error) {
    console.error("Error responding to invite:", error);
    throw error;
  }
};

const handleStoryUpload = async (pickStory: Promise<string[]>, user: User) => {
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
};

const fetchTags = (callback: (tags: any[]) => void) => {
  try {
    const db = getFirestore();
    const tagsRef = collection(db, "tags");

    const unsubscribe = onSnapshot(
      tagsRef,
      snapshot => {
        const firstDoc = snapshot.docs[0];
        const data = firstDoc.data();
        callback(data.tags || []);
      },
      error => {
        console.error("❌ Error in tags listener:", error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("❌ Error fetching tags:", error);
    throw error;
  }
};

const fetchGenders = (callback: (genders: any[]) => void) => {
  try {
    const db = getFirestore();
    const gendersRef = collection(db, "genders");

    const unsubscribe = onSnapshot(
      gendersRef,
      snapshot => {
        const firstDoc = snapshot.docs[0];
        const data = firstDoc.data();
        callback(data.genders || []);
      },
      error => {
        console.error("❌ Error in genders listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("❌ Error fetching genders:", error);
    throw error;
  }
};

const getRandomUser = async (
  currentUserId: string,
  excludeUserIds: string[] = []
) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const availableUsers = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (user: any) =>
          user.id !== currentUserId &&
          !excludeUserIds.includes(user.id) &&
          user.isProfileComplete === true
      );

    if (availableUsers.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const selectedUser = availableUsers[randomIndex];

    // Add to viewed users in Redux
    store.dispatch(addViewedUser(selectedUser.id));

    return selectedUser;
  } catch (error) {
    console.error("Error fetching random user:", error);
    throw error;
  }
};

const recordLike = async (currentUserId: string, likedUserId: string) => {
  try {
    const db = getFirestore();

    // Add to current user's likes
    const currentUserLikesRef = doc(
      db,
      "users",
      currentUserId,
      "likes",
      likedUserId
    );
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
    const likedUserLikesRef = doc(
      db,
      "users",
      likedUserId,
      "likes",
      currentUserId
    );
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

const getNextUserForSwipe = async (
  currentUserId: string,
  excludeUserIds: string[] = []
) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    // DEBUG: Log all users first
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get current state
    const state = store.getState();
    const viewedUserIds = state.swipe.viewedUserIds || [];
    // Get liked users
    const currentUserLikesRef = collection(db, "users", currentUserId, "likes");
    const likesSnapshot = await getDocs(currentUserLikesRef);
    const likedUserIds = likesSnapshot.docs.map(doc => doc.id);

    const availableUsers = allUsers.filter(
      (user: any) =>
        user.id !== currentUserId &&
        !excludeUserIds.includes(user.id) &&
        !likedUserIds.includes(user.id) &&
        !viewedUserIds.includes(user.id) &&
        user.isProfileComplete === true
    );

    if (availableUsers.length === 0) {
      const anyEligibleUsers = allUsers.filter(
        (user: any) =>
          user.id !== currentUserId &&
          !excludeUserIds.includes(user.id) &&
          !likedUserIds.includes(user.id) &&
          user.isProfileComplete === true
      );

      if (anyEligibleUsers.length === 0) {
        return null;
      }

      store.dispatch(resetViewedUsers());
      return getNextUserForSwipe(currentUserId, excludeUserIds);
    }

    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const nextUser = availableUsers[randomIndex];

    store.dispatch(addViewedUser(nextUser.id));
    return nextUser;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

let unsubscribeLikes: (() => void) | null = null;
let unsubscribeMatches: (() => void) | null = null;

const fetchUserMatches = async (
  currentUserId: string,
  onUpdate: (matches: any[]) => void
) => {
  try {
    const db = getFirestore();

    const matchesRef = collection(db, "matches");
    const currentUserLikesRef = collection(db, "users", currentUserId, "likes");

    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    if (!currentUserDoc.exists()) throw new Error("Current user not found");
    const currentUserData = currentUserDoc.data();

    // 🔄 Listen to matches
    unsubscribeMatches = onSnapshot(matchesRef, async matchesSnapshot => {
      const mutualMatches: any[] = [];
      const matchedUserIds: string[] = [];

      matchesSnapshot.forEach(docSnap => {
        const matchData = docSnap.data();
        if (matchData.users.includes(currentUserId) && matchData.isActive) {
          const otherUserId = matchData.users.find(
            (id: string) => id !== currentUserId
          );
          if (otherUserId) {
            mutualMatches.push({
              id: docSnap.id,
              otherUserId,
              matchedAt: matchData.matchedAt,
              status: "matched",
            });
            matchedUserIds.push(otherUserId);
          }
        }
      });

      // 🔄 Listen to likes
      if (unsubscribeLikes) unsubscribeLikes(); // clear old listener

      unsubscribeLikes = onSnapshot(
        currentUserLikesRef,
        async likesSnapshot => {
          const pendingMatches: any[] = [];

          await Promise.all(
            likesSnapshot.docs.map(async likeDoc => {
              const likedUserId = likeDoc.id;

              if (matchedUserIds.includes(likedUserId)) return;

              const theirLikeRef = doc(
                db,
                "users",
                likedUserId,
                "likes",
                currentUserId
              );
              const theirLikeDoc = await getDoc(theirLikeRef);

              if (!theirLikeDoc.exists()) {
                pendingMatches.push({
                  id: `pending_${currentUserId}_${likedUserId}`,
                  otherUserId: likedUserId,
                  likedAt: likeDoc.data().likedAt,
                  status: "pending",
                });
              }
            })
          );

          const allMatches = [...mutualMatches, ...pendingMatches];

          const matchesWithUserData = await Promise.all(
            allMatches.map(async match => {
              try {
                const userDoc = await getDoc(
                  doc(db, "users", match.otherUserId)
                );
                if (userDoc.exists()) {
                  const userData = userDoc.data() as any;

                  const distanceInMeters = getDistanceFromLatLonInMeters(
                    currentUserData.location.latitude,
                    currentUserData.location.longitude,
                    userData.location.latitude,
                    userData.location.longitude
                  );

                  const distance =
                    distanceInMeters > 1000
                      ? `${(distanceInMeters / 1000).toFixed(1)} km away`
                      : `${Math.round(distanceInMeters)} m away`;

                  const matchPercentage = calculateMatchScore(
                    {
                      userId: currentUserId,
                      intent: currentUserData.lookingFor,
                      profileScore: currentUserData.profileScore,
                    },
                    {
                      userId: match.otherUserId,
                      intent: userData.lookingFor,
                      profileScore: userData.profileScore,
                    }
                  );

                  let locationString = "UNKNOWN";
                  if (userData.location) {
                    if (typeof userData.location === "string") {
                      locationString = userData.location;
                    } else if (userData.location.city) {
                      locationString = userData.location.city;
                    } else if (
                      userData.location.latitude &&
                      userData.location.longitude
                    ) {
                      locationString = "LOCATION";
                    }
                  }

                  return {
                    id: match.id,
                    userId: match.otherUserId,
                    name: userData.name || "Unknown",
                    age: userData.age || 25,
                    location: locationString,
                    distance,
                    image: userData.photo,
                    matchPercentage,
                    timestamp: match.matchedAt || match.likedAt,
                    status: match.status,
                    isPending: match.status === "pending",
                  };
                }
                return null;
              } catch (error) {
                console.error("Error fetching user data:", error);
                return null;
              }
            })
          );

          const validMatches = matchesWithUserData.filter(m => m !== null);
          onUpdate(validMatches); // 🔁 Push result to your component
        }
      );
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    onUpdate([]);
  }
};

export const unsubscribeUserMatches = () => {
  if (unsubscribeMatches) unsubscribeMatches();
  if (unsubscribeLikes) unsubscribeLikes();
};

const fetchQuestionnaires = (callback: (questionnaires: any[]) => void) => {
  try {
    const db = getFirestore();
    const questionnairesRef = collection(db, "questionnaire");

    const unsubscribe = onSnapshot(
      questionnairesRef,
      snapshot => {
        // Flatten all questionnaire arrays from all docs
        const questionnaires = snapshot.docs.flatMap(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
            doc.data() || []
        );
        callback(questionnaires);
      },
      error => {
        console.error("Error in questionnaires listener:", error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up questionnaires listener:", error);
    throw error;
  }
};

const deleteUser = async (
  user: FirebaseAuthTypes.User
): Promise<{ success: boolean; error?: string }> => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);

    // 1. Delete user's likes
    const userLikesRef = collection(db, "users", user.uid, "likes");
    const userLikesSnapshot = await getDocs(userLikesRef);
    userLikesSnapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });

    // 2. Delete likes from other users that target this user
    const allUsersSnapshot = await getDocs(collection(db, "users"));
    for (const userDoc of allUsersSnapshot.docs) {
      if (userDoc.id !== user.uid) {
        const otherUserLikeRef = doc(
          db,
          "users",
          userDoc.id,
          "likes",
          user.uid
        );
        const otherUserLikeDoc = await getDoc(otherUserLikeRef);
        if (otherUserLikeDoc.exists()) {
          batch.delete(otherUserLikeRef);
        }
      }
    }

    // 3. Delete matches involving this user
    const matchesRef = collection(db, "matches");
    const matchesSnapshot = await getDocs(matchesRef);
    matchesSnapshot.docs.forEach((doc: any) => {
      const matchData = doc.data();
      if (matchData.users && matchData.users.includes(user.uid)) {
        batch.delete(doc.ref);
      }
    });

    // 4. Delete user's stories
    const userStoriesRef = doc(db, "stories", user.uid);
    const userStoriesDoc = await getDoc(userStoriesRef);
    if (userStoriesDoc.exists()) {
      batch.delete(userStoriesRef);
    }

    // 5. Delete user's notifications
    const userNotificationsRef = doc(db, "notifications", user.uid);
    const userNotificationsDoc = await getDoc(userNotificationsRef);
    if (userNotificationsDoc.exists()) {
      batch.delete(userNotificationsRef);
    }

    // 6. Delete user's reels
    const reelsRef = collection(db, "reels");
    const userReelsSnapshot = await getDocs(
      query(reelsRef, where("userId", "==", user.uid))
    );
    userReelsSnapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });

    // 7. Delete user's messages/chats
    const messagesRef = collection(db, "messages");
    const userMessagesSnapshot = await getDocs(messagesRef);
    userMessagesSnapshot.docs.forEach((doc: any) => {
      const messageData = doc.data();
      // Delete if user is part of this chat/group
      if (messageData.users && Array.isArray(messageData.users)) {
        const userInChat = messageData.users.find(
          (i: any) => i.uid === user.uid
        );
        if (userInChat) {
          // If it's a group chat, remove the user from the group
          if (messageData.type === "group") {
            const updatedUsers = messageData.users.filter(
              (i: any) => i.uid !== user.uid
            );
            if (updatedUsers.length === 0) {
              batch.delete(doc.ref);
            } else {
              batch.update(doc.ref, { users: updatedUsers });
            }
          } else {
            // For direct messages, delete the entire chat
            batch.delete(doc.ref);
          }
        }
      }
    });

    // 8. Delete user document
    batch.delete(doc(db, "users", user.uid));

    // 9. Delete guardian document (if exists)
    const guardianRef = doc(db, "guardian", user.uid);
    const guardianDoc = await getDoc(guardianRef);
    if (guardianDoc.exists()) {
      batch.delete(guardianRef);
    }

    // 10. Delete all user files from Firebase Storage (including nested directories)
    try {
      const userStorageRef = ref(storage, `users/${user.uid}`);

      const deleteAllFilesRecursively = async (directoryRef: any) => {
        const result = await listAll(directoryRef);

        const fileDeletePromises = result.items.map(itemRef =>
          deleteObject(itemRef)
        );

        const subdirectoryDeletePromises = result.prefixes.map(prefixRef =>
          deleteAllFilesRecursively(prefixRef)
        );

        await Promise.all([
          ...fileDeletePromises,
          ...subdirectoryDeletePromises,
        ]);
      };

      await deleteAllFilesRecursively(userStorageRef);
    } catch (error) {
      console.warn("Failed to delete user storage files:", error);
    }

    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Failed to delete user and associated data",
    };
  }
};

const addGuardianMobileNumber = async (
  phoneNumber: string
): Promise<{ success: boolean; error: string }> => {
  try {
    const db = getFirestore();

    // Check if number already exists
    const existingGuardian = await checkGuardianMobileNumber(phoneNumber);
    if (existingGuardian.exists) {
      if (existingGuardian.inGuardian) {
        return {
          success: false,
          error: "Mobile number already is a registered guardian",
        };
      } else if (existingGuardian.inUsers) {
        return {
          success: false,
          error: "Mobile number already exists as a user",
        };
      }
    }

    // Add to guardian collection

    const auth = getAuth();
    const user = auth.currentUser;

    const guardianRef = doc(db, "guardian", user?.uid || "");
    await setDoc(guardianRef, {
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, error: "" };
  } catch (error: any) {
    console.error("Error adding guardian mobile number:", error);
    return {
      success: false,
      error: error.message || "Failed to add guardian mobile number",
    };
  }
};

const checkGuardianMobileNumber = async (
  mobileNumber: string
): Promise<{
  exists: boolean;
  error?: string;
  inGuardian?: boolean;
  inUsers?: boolean;
}> => {
  try {
    const db = getFirestore();

    const guardianRef = collection(db, "guardian");
    const guardianQuery = query(
      guardianRef,
      where("phoneNumber", "==", mobileNumber)
    );
    const guardianSnapshot = await getDocs(guardianQuery);

    const usersRef = collection(db, "users");
    const usersQuery = query(
      usersRef,
      where("phoneNumber", "==", mobileNumber)
    );
    const usersSnapshot = await getDocs(usersQuery);

    const existsInGuardian = !guardianSnapshot.empty;
    const existsInUsers = !usersSnapshot.empty;

    return {
      exists: existsInGuardian || existsInUsers,
      inGuardian: existsInGuardian,
      inUsers: existsInUsers,
    };
  } catch (error: any) {
    console.error("Error checking guardian mobile number:", error);
    return {
      exists: false,
      error: error.message || "Failed to check guardian mobile number",
    };
  }
};

const getUserByGuardianPhone = async (guardianPhoneNumber: string) => {
  try {
    const db = getFirestore();

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("guardianPhone", "==", guardianPhoneNumber)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error: any) {
    console.error("Error getting user data by guardian phone number:", error);
    throw new Error(
      `Failed to get user data by guardian phone: ${error.message}`
    );
  }
};

export {
  addGuardianMobileNumber,
  authenticateWithPhone,
  checkForMatch,
  checkGuardianMobileNumber,
  checkUserExistsForSignup,
  deleteImage,
  deleteUser,
  fetchAllUsers,
  fetchAllUserStories,
  fetchGenders,
  fetchNextUsersStories,
  fetchQuestionnaires,
  fetchStoriesForUser,
  fetchTags,
  fetchUserMatches,
  getCurrentAuth,
  getNextUserForSwipe,
  getRandomUser,
  getUserByEmail,
  getUserByGuardianPhone,
  getUserByUid,
  getUserByUidAsync,
  getUserLocation,
  handleStoryUpload,
  recordLike,
  saveUserToDatabase,
  signInWithGoogleFirebase,
  updateUser,
  uploadImage,
  uploadMultipleImages,
  verifyCode,
};
