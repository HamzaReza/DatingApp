import getDistanceFromLatLonInMeters from "./Distance";
import { calculateMatchScore } from "./MatchScore";

export function filterUsers({
  currentUser,
  users,
  age,
  height,
  maritalStatus,
  location,
  distance,
  interests = "",
  alcoholPreference,
  smokingPreference,
  relationshipIntent,
  deviceLocation,
}: any): any[] {
  // Toggle filters ON/OFF for testing

  function heightToInches(heightStr: string): number {
    const match = heightStr.match(/^(\d+)'(\d{1,2})"?$/);
    if (!match) return 0;
    const feet = parseInt(match[1], 10);
    const inches = parseInt(match[2], 10);
    return feet * 12 + inches;
  }

  const filtred = users.filter((user: any) => {
    // Age

    if (age && user.age) {
      if (Number(user.age) > Number(age)) {
        return false;
      }
    }

    //Height
    if (height && user.height) {
      const userHeightInInches = heightToInches(user.height);
      const filterHeightInInches = heightToInches(height);

      if (userHeightInInches > filterHeightInInches) {
        return false;
      }
    }

    // Marital Status
    if (
      maritalStatus?.trim() &&
      user.maritalStatus?.trim() &&
      user.maritalStatus.toLowerCase() !== maritalStatus.toLowerCase()
    ) {
      return false;
    }
    // Location
    if (location && user.locationName) {
      if (user.locationName !== location) {
        return false;
      }
    }

    // Distance (in km)
    if (distance && deviceLocation && user.location) {
      const userDistance = getDistanceFromLatLonInMeters(
        deviceLocation.latitude,
        deviceLocation.longitude,
        user.location.latitude,
        user.location.longitude
      );
      if (userDistance / 1000 > distance) {
        return false;
      }
    }

    // Alcohol
    if (alcoholPreference && user.alcohol) {
      if (user.alcohol !== alcoholPreference) {
        return false;
      }
    }

    // // Smoking
    if (smokingPreference && user.smoking) {
      if (user.smoking !== smokingPreference) {
        return false;
      }
    }

    // Relationship Intent
    if (relationshipIntent && user.lookingFor) {
      if (user.lookingFor !== relationshipIntent) {
        return false;
      }
    }

    // Matching Score Filter
    if (currentUser && user.lookingFor && user.profileScore) {
      const userA: any = {
        userId: currentUser.uid,
        intent: currentUser.lookingFor,
        profileScore: currentUser.profileScore ?? 0,
      };

      const userB: any = {
        userId: user.uid,
        intent: user.lookingFor,
        profileScore: user.profileScore ?? 0,
      };

      const matchScore = calculateMatchScore(userA, userB);

      if (interests) {
        const [minStr, maxStr] = interests.split("-");
        const min = parseInt(minStr);
        const max = parseInt(maxStr);

        if (matchScore < min || matchScore > max) {
          return false;
        }
      }
    }

    return true;
  });

  return filtred;
}
