import { useState, useEffect } from "react";
import { getAuth } from "@react-native-firebase/auth";
import { getUserByUid } from "@/firebase/auth";
import {
  fetchUserMeetingData,
  getOtherUserId,
  checkFixedMeetDetails,
  checkRejectionStatus,
  MeetingData,
  FixedMeetDetails,
} from "@/firebase/meet";

interface UseMeetingDataReturn {
  // User data
  userData: any;
  otherUserData: any;
  otherUserMeet: MeetingData | null;
  otherUid: string;

  // Meeting status
  fixedDetails: FixedMeetDetails;
  rejectionStatus: {
    date: boolean;
    time: boolean;
    place: boolean;
  };

  // Loading states
  loading: boolean;

  // Refresh function
  refreshData: () => Promise<void>;
}

export const useMeetingData = (matchId: string): UseMeetingDataReturn => {
  const [userData, setUserData] = useState<any>([]);
  const [otherUserData, setOtherUserData] = useState<any>([]);
  const [otherUserMeet, setOtherUserMeet] = useState<MeetingData | null>(null);
  const [otherUid, setOtherUid] = useState("");
  const [fixedDetails, setFixedDetails] = useState<FixedMeetDetails>({
    placeFixed: false,
    dateFixed: false,
    timeFixed: false,
  });
  const [rejectionStatus, setRejectionStatus] = useState({
    date: false,
    time: false,
    place: false,
  });
  const [loading, setLoading] = useState(true);

  const currentUser = getAuth().currentUser;

  // Initialize otherUid
  useEffect(() => {
    if (matchId && currentUser?.uid) {
      const otherUserId = getOtherUserId(matchId, currentUser.uid);
      setOtherUid(otherUserId);
    }
  }, [matchId, currentUser?.uid]);

  // Load all data
  const loadData = async () => {
    if (!matchId || !currentUser?.uid || !otherUid) return;

    setLoading(true);

    try {
      // Load data in parallel
      const [
        currentUserData,
        otherUserProfileData,
        otherMeetData,
        fixedMeetDetails,
        rejectionData,
      ] = await Promise.all([
        getUserByUid(currentUser.uid),
        getUserByUid(otherUid.trim()),
        fetchUserMeetingData(matchId, otherUid),
        checkFixedMeetDetails(matchId),
        checkRejectionStatus(matchId, currentUser.uid),
      ]);

      setUserData(currentUserData);
      setOtherUserData(otherUserProfileData);
      setOtherUserMeet(otherMeetData);
      setFixedDetails(fixedMeetDetails);
      setRejectionStatus(rejectionData);
    } catch (error) {
      console.error("Error loading meeting data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when dependencies change
  useEffect(() => {
    if (otherUid) {
      loadData();
    }
  }, [matchId, currentUser?.uid, otherUid]);

  const refreshData = async () => {
    await loadData();
  };

  return {
    userData,
    otherUserData,
    otherUserMeet,
    otherUid,
    fixedDetails,
    rejectionStatus,
    loading,
    refreshData,
  };
};
