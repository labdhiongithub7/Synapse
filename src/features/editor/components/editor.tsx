"use client";

interface EditorProps {
  workflowId: string;
}

export const Editor = ({ workflowId }: EditorProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground text-sm">
        Editor for workflow: {workflowId}
      </p>
    </div>
  );
};
