import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getUserByUid } from "@/firebase/auth";

const db = getFirestore();

export interface MeetingData {
  userId: string;
  places?: string[];
  dates?: string[];
  times?: string[];
  createdAt: string;
}

export interface MutualData {
  places?: string[];
  dates?: string[];
  times?: string[];
  createdAt: string;
}

export interface RejectionData {
  userId: string;
  reasons: Record<string, string>;
  unavailable: string[];
  updatedAt: string;
}

export interface FixedMeetDetails {
  placeFixed: boolean;
  dateFixed: boolean;
  timeFixed: boolean;
}

// Extract other user ID from combined match ID
export const getOtherUserId = (
  combinedId: string,
  currentUserId: string
): string => {
  const [id1, id2] = combinedId.split("_");
  return id1 === currentUserId ? id2 : id1;
};

// Fetch user meeting preferences
export const fetchUserMeetingData = async (
  matchId: string,
  userId: string
): Promise<MeetingData | null> => {
  try {
    const docRef = doc(db, "messages", matchId, "meet", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as MeetingData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user meeting data:", error);
    return null;
  }
};

// Check if meeting details are fixed
export const checkFixedMeetDetails = async (
  matchId: string
): Promise<FixedMeetDetails> => {
  try {
    const mutualRef = doc(db, "messages", matchId, "meet", "mutual");
    const mutualSnap = await getDoc(mutualRef);

    if (!mutualSnap.exists()) {
      return {
        placeFixed: false,
        dateFixed: false,
        timeFixed: false,
      };
    }

    const mutualData = mutualSnap.data() as MutualData;

    const placeFixed =
      Array.isArray(mutualData.places) && mutualData.places.length > 0;
    const dateFixed =
      Array.isArray(mutualData.dates) && mutualData.dates.length > 0;
    const timeFixed =
      Array.isArray(mutualData.times) && mutualData.times.length > 0;

    return { placeFixed, dateFixed, timeFixed };
  } catch (error) {
    console.error("Error checking mutual meet data:", error);
    return {
      placeFixed: false,
      dateFixed: false,
      timeFixed: false,
    };
  }
};

// Check rejection status
export const checkRejectionStatus = async (
  matchId: string,
  currentUserId: string
): Promise<{ date: boolean; time: boolean; place: boolean }> => {
  try {
    const rejectedDocRef = doc(db, "messages", matchId, "meet", "rejected");
    const docSnap = await getDoc(rejectedDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as RejectionData;

      if (data.userId === currentUserId && Array.isArray(data.unavailable)) {
        const rejectedArray = data.unavailable;

        return {
          date: rejectedArray.includes("Dates"),
          time: rejectedArray.includes("Times"),
          place: rejectedArray.includes("Places"),
        };
      }
    }

    return { date: false, time: false, place: false };
  } catch (error) {
    console.error("Error checking rejection status:", error);
    return { date: false, time: false, place: false };
  }
};

// Handle mutual selection
export const handleMutualSelection = async (
  matchId: string,
  currentUserId: string,
  selectedPlaces: string[],
  selectedDates: string[],
  selectedTimes: string[]
): Promise<boolean> => {
  try {
    const snap = await getDocs(collection(db, "messages", matchId, "meet"));

    const other = snap.docs.find(
      (d: any) => d.id !== currentUserId && d.id !== "confirm"
    );
    if (!other) return false;

    const otherData = other.data() as MeetingData;

    const mutualPlaces =
      otherData.places?.filter(p => selectedPlaces?.includes(p)) || [];
    const mutualDates =
      otherData.dates?.filter(d => selectedDates?.includes(d)) || [];
    const mutualTimes =
      otherData.times?.filter(t => selectedTimes?.includes(t)) || [];

    if (!mutualPlaces.length && !mutualDates.length && !mutualTimes.length) {
      return false;
    }

    const mutualData: Partial<MutualData> = {
      createdAt: new Date().toISOString(),
    };

    if (mutualPlaces.length) mutualData.places = mutualPlaces;
    if (mutualDates.length) mutualData.dates = mutualDates;
    if (mutualTimes.length) mutualData.times = mutualTimes;

    await setDoc(doc(db, "messages", matchId, "meet", "mutual"), mutualData, {
      merge: true,
    });

    return true;
  } catch (error) {
    console.error("Error handling mutual selection:", error);
    return false;
  }
};

// Create final meeting
export const createFinalMeet = async (matchId: string): Promise<void> => {
  const mutualSnap = await getDoc(
    doc(db, "messages", matchId, "meet", "mutual")
  );

  if (!mutualSnap.exists()) {
    throw new Error("No mutual data found");
  }

  const mutual = mutualSnap.data() as MutualData;

  // Select random mutual options
  const finalPlace =
    mutual.places?.[Math.floor(Math.random() * mutual.places.length)];
  const finalTime =
    mutual.times?.[Math.floor(Math.random() * mutual.times.length)];
  const finalDate = mutual.dates?.sort()[0];

  // Create confirm document
  await setDoc(doc(db, "messages", matchId, "meet", "confirm"), {
    finalPlace,
    finalDate,
    finalTime,
    createdAt: new Date().toISOString(),
  });

  // Delete rejection document if exists
  const rejectionRef = doc(db, "messages", matchId, "meet", "rejected");
  await deleteDoc(rejectionRef).catch(() => {});
};

// Save user meeting preferences
export const saveUserMeetingPreferences = async (
  matchId: string,
  userId: string,
  places: string[],
  dates: string[],
  times: string[]
): Promise<void> => {
  const userMeetRef = doc(db, "messages", matchId, "meet", userId);
  await setDoc(userMeetRef, {
    userId,
    places,
    dates,
    times,
    createdAt: new Date().toISOString(),
  });
};

// Handle rejection
export const handleReject = async ({
  matchId,
  currentUserId,
  unavailable,
  reason,
}: {
  matchId: string;
  currentUserId: string;
  unavailable: string[];
  reason: string;
}): Promise<void> => {
  // Get existing rejection doc if it exists
  const rejectionRef = doc(db, "messages", matchId, "meet", "rejected");
  const existingRejection = (await getDoc(rejectionRef)).data() || {};

  // Format new unavailable items with first letter caps
  const formattedUnavailable = unavailable.map(
    item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
  );

  // Create reason entries for each unavailable item
  const newReasonEntries = formattedUnavailable.reduce((acc, item) => {
    acc[item] = reason;
    return acc;
  }, {} as Record<string, string>);

  // Merge with existing data
  const updatedRejection: RejectionData = {
    ...existingRejection,
    userId: currentUserId,
    reasons: {
      ...existingRejection.reasons,
      ...newReasonEntries,
    },
    unavailable: [
      ...new Set([
        ...(existingRejection.unavailable || []),
        ...formattedUnavailable,
      ]),
    ],
    updatedAt: new Date().toISOString(),
  };

  // Save to Firestore
  await setDoc(rejectionRef, updatedRejection);

  // Cleanup mutual/confirm docs
  await Promise.all([
    deleteDoc(doc(db, "messages", matchId, "meet", "mutual")),
    deleteDoc(doc(db, "messages", matchId, "meet", "confirm")),
  ]);
};

// Check if this is the first entry
export const checkIsFirstEntry = async (
  matchId: string,
  currentUserId: string,
  otherUid: string
): Promise<boolean> => {
  const meetSnap = await getDocs(collection(db, "messages", matchId, "meet"));
  const meetDocIds = meetSnap.docs.map((doc: any) => doc.id);
  return !meetDocIds.includes(currentUserId) || !meetDocIds.includes(otherUid);
};
