import { useState } from "react";

interface RejectModalState {
  visible: boolean;
  category: string;
  reason: string;
}

interface UseRejectModalReturn {
  rejectModal: RejectModalState;
  openRejectModal: (category: string) => void;
  closeRejectModal: () => void;
  updateReason: (reason: string) => void;
}

export const useRejectModal = (): UseRejectModalReturn => {
  const [rejectModal, setRejectModal] = useState<RejectModalState>({
    visible: false,
    category: "",
    reason: "",
  });

  const openRejectModal = (category: string) => {
    setRejectModal({
      visible: true,
      category,
      reason: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      visible: false,
      category: "",
      reason: "",
    });
  };

  const updateReason = (reason: string) => {
    setRejectModal(prev => ({ ...prev, reason }));
  };

  return {
    rejectModal,
    openRejectModal,
    closeRejectModal,
    updateReason,
  };
};
