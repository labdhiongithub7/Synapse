"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { SparklesIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AiTextGenerationFormValues, AiTextGenerationDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";

type AiTextGenerationNodeData = {
  variableName?: string;
  prompt?: string;
  credentialId?: string;
};

type AiTextGenerationNodeType = Node<AiTextGenerationNodeData>;

export const AiTextGenerationNode = memo((props: NodeProps<AiTextGenerationNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: AiTextGenerationFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          }
        }
      }
      return node;
    }))
  };

  const nodeData = props.data;
  const description = nodeData?.prompt
    ? "Prompt configured"
    : "Not configured";

  return (
    <>
      <AiTextGenerationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={SparklesIcon}
        name="AI Text Generation"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

AiTextGenerationNode.displayName = "AiTextGenerationNode";
