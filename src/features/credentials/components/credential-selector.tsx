"use client";

import { useState } from "react";
import { CredentialType } from "@/generated/prisma";
import { useCredentialsByType } from "../hooks/use-credentials";
import { CreateCredentialModal } from "./create-credential-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2Icon } from "lucide-react";

interface Props {
  type: CredentialType;
  value?: string;
  onChange: (value: string) => void;
}

export const CredentialSelector = ({ type, value, onChange }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: credentials, isLoading } = useCredentialsByType(type);

  return (
    <div className="flex flex-col gap-2">
      <CreateCredentialModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultType={type}
      />
      
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Select a ${type} credential`} />
          </SelectTrigger>
          <SelectContent>
            {credentials?.map((cred) => (
              <SelectItem key={cred.id} value={cred.id}>
                {cred.name}
              </SelectItem>
            ))}
            {credentials?.length === 0 && (
              <SelectItem value="none" disabled>
                No credentials found
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlusIcon className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
