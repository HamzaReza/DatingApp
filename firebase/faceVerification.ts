import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

export interface FaceVerificationResult {
  isMatch: boolean;
  confidence: number;
  error?: string;
}

const functions = getFunctions();

/**
 * Verify if a new image matches the user's profile picture
 */
export const verifyFaceMatch = async (
  userId: string,
  newImageUrl: string,
  profileImageUrl: string
): Promise<FaceVerificationResult> => {
  try {
    const verifyFaceMatchFunction = httpsCallable(functions, "verifyFaceMatch");
    const result = await verifyFaceMatchFunction({
      userId,
      newImageUrl,
      profileImageUrl,
    });

    return result.data as FaceVerificationResult;
  } catch (error: any) {
    console.error("Error verifying face match:", error);
    return {
      isMatch: false,
      confidence: 0,
      error: error.message || "Face verification failed",
    };
  }
};
