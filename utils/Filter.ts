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
      console.log(`Checking age: User(${user.age}) <= Filter(${age})`);
      if (Number(user.age) > Number(age)) {
        console.log("Rejected by age");
        return false;
      }
    }

    //Height
    if (height && user.height) {
      const userHeightInInches = heightToInches(user.height);
      const filterHeightInInches = heightToInches(height);

      console.log(
        `Checking height: User(${user.height} = ${userHeightInInches}) <= Filter(${height} = ${filterHeightInInches})`
      );

      if (userHeightInInches > filterHeightInInches) {
        console.log("❌ Rejected by height");
        return false;
      }
    }

    // Marital Status
    if (
      maritalStatus?.trim() &&
      user.maritalStatus?.trim() &&
      user.maritalStatus.toLowerCase() !== maritalStatus.toLowerCase()
    ) {
      console.log(
        `Rejected by maritalStatus: User(${user.maritalStatus}) ≠ Filter(${maritalStatus})`
      );
      return false;
    }
    // Location
    if (location && user.locationName) {
      console.log(
        `Checking location: User(${user.locationName}) === Filter(${location})`
      );
      if (user.locationName !== location) {
        console.log("Rejected by location");
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
      console.log(
        `Checking distance: ${userDistance / 1000} km <= ${distance} km`
      );
      if (userDistance / 1000 > distance) {
        console.log("Rejected by distance");
        return false;
      }
    }

    // Alcohol
    if (alcoholPreference && user.alcohol) {
      console.log(
        `Checking alcoholPreference: ${user.alcohol} === ${alcoholPreference}`
      );
      if (user.alcohol !== alcoholPreference) {
        console.log("Rejected by alcohol preference");
        return false;
      }
    }

    // // Smoking
    if (smokingPreference && user.smoking) {
      console.log(
        `Checking smokingPreference: ${user.smoking} === ${smokingPreference}`
      );
      if (user.smoking !== smokingPreference) {
        console.log("Rejected by smoking preference");
        return false;
      }
    }

    // Relationship Intent
    if (relationshipIntent && user.lookingFor) {
      console.log(
        `Checking relationshipIntent: ${user.lookingFor} === ${relationshipIntent}`
      );
      if (user.lookingFor !== relationshipIntent) {
        console.log("Rejected by relationship intent");
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
      console.log(`💘 Match Score with ${user.name}: ${matchScore}`);

      if (interests) {
        const [minStr, maxStr] = interests.split("-");
        const min = parseInt(minStr);
        const max = parseInt(maxStr);

        if (matchScore < min || matchScore > max) {
          console.log("❌ Rejected by match score range");
          return false;
        }
      }
    }

    return true;
  });
  //   console.log("filtred", filtred);
  return filtred;
}
