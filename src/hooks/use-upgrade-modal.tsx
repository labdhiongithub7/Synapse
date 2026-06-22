"use client";

import { useCallback, useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);

  const handleError = useCallback((error: { message: string }) => {
    if (error.message?.includes("FORBIDDEN")) {
      setOpen(true);
    }
  }, []);

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return {
    open,
    setOpen,
    handleError,
    modal,
  };
};
