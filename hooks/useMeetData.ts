/* eslint-disable react-hooks/exhaustive-deps */
import { getUserByUid } from "@/firebase/auth";
import {
  checkFixedMeetDetails,
  checkRejectionStatus,
  fetchUserMeetingData,
  FixedMeetDetails,
  getOtherUserId,
  MeetingData,
} from "@/firebase/meet";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

  const { user } = useSelector((state: RootState) => state.user);
  console.log("user", user);

  // Initialize otherUid
  useEffect(() => {
    if (matchId && user?.uid) {
      const otherUserId = getOtherUserId(matchId, user.uid);
      setOtherUid(otherUserId);
    }
  }, [matchId, user?.uid]);

  // Load all data
  const loadData = async () => {
    if (!matchId || !user?.uid || !otherUid) return;

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
        getUserByUid(user.uid),
        getUserByUid(otherUid.trim()),
        fetchUserMeetingData(matchId, otherUid),
        checkFixedMeetDetails(matchId),
        checkRejectionStatus(matchId, user.uid),
      ]);

      console.log("currentUserData", currentUserData);

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
  }, [matchId, user?.uid, otherUid]);

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
