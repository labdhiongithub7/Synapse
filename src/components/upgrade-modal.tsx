"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

export const UpgradeModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    await authClient.checkout({
      products: [{ productId: "ad8b2fdf-15b5-4600-89d2-ee9c25d21a27" }],
    });
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            You&apos;ve reached the limit for your current plan. Upgrade to Pro
            to unlock unlimited workflows and more features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={isLoading}>
            {isLoading ? "Loading..." : "Upgrade to Pro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
