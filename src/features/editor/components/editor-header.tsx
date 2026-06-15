"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, EditIcon, PlayIcon, SaveIcon } from "lucide-react";
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface EditorHeaderProps {
  workflowId: string;
}

export const EditorHeader = ({ workflowId }: EditorHeaderProps) => {
  const router = useRouter();
  const workflow = useSuspenseWorkflow(workflowId);
  const updateName = useUpdateWorkflowName();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.data?.name ?? "");

  const handleSaveName = () => {
    updateName.mutate({
      id: workflowId,
      name,
    });
    setIsEditing(false);
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <div className="flex items-center gap-x-2 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/workflows")}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 w-auto"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setName(workflow.data?.name ?? "");
                }
              }}
            />
            <Button size="sm" onClick={handleSaveName} disabled={updateName.isPending}>
              <SaveIcon className="size-3.5" />
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setIsEditing(true)}
          >
            {workflow.data?.name}
            <EditIcon className="size-3.5 ml-2 text-muted-foreground" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Button size="sm" disabled>
          <PlayIcon className="size-3.5" />
          Execute
        </Button>
      </div>
    </header>
  );
};
