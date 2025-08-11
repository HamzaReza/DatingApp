import { checkBothUsersPaid } from "@/firebase/stripe";
import { useEffect, useState } from "react";

export const useBothUsersPaid = (
  matchId: string | undefined,
  isSingleChat: boolean
) => {
  const [bothUsersPaid, setBothUsersPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (isSingleChat && matchId) {
        setIsLoading(true);
        try {
          const paid = await checkBothUsersPaid(matchId);
          setBothUsersPaid(paid);
        } catch (error) {
          console.error("Error checking payment status:", error);
          setBothUsersPaid(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkPaymentStatus();
  }, [matchId, isSingleChat]);

  return { bothUsersPaid, isLoading };
};
