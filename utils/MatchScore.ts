type RelationshipIntent = "casual" | "relationship" | "marriage" | "not_sure";

type UserProfile = {
  userId: string;
  intent: RelationshipIntent;
  profileScore: number; // this is in range 0–100
};

function intentCompatibility(
  a: RelationshipIntent,
  b: RelationshipIntent
): number {
  if (a === b) return 1.0;
  if (a === "not_sure" || b === "not_sure") return 0.6;
  return 0.2;
}

function profileSimilarity(scoreA: number, scoreB: number): number {
  const diff = Math.abs(scoreA - scoreB);
  return 1 - diff;
}

export function calculateMatchScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  // ✅ Normalize profile scores to 0–1
  const normalizedScoreA = userA.profileScore / 100;
  const normalizedScoreB = userB.profileScore / 100;

  const intentScore = intentCompatibility(userA.intent, userB.intent);
  const profileSim = profileSimilarity(normalizedScoreA, normalizedScoreB);

  const finalScore = intentScore * 0.4 + profileSim * 0.6;
  const scoreOutOf100 = Math.round(finalScore * 100);

  return isNaN(scoreOutOf100) ? 0 : scoreOutOf100;
}
