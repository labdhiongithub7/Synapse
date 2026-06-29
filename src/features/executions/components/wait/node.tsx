"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { WaitFormValues, WaitDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchWaitRealtimeToken } from "./actions";
import { WAIT_CHANNEL_NAME } from "@/inngest/channels/wait";
import { ClockIcon } from "lucide-react";

type WaitNodeData = {
  duration?: string;
  unit?: "seconds" | "minutes" | "hours";
};

type WaitNodeType = Node<WaitNodeData>;

export const WaitNode = memo((props: NodeProps<WaitNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: WAIT_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchWaitRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: WaitFormValues) => {
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
  const description = nodeData?.duration
    ? `Wait ${nodeData.duration} ${nodeData.unit}`
    : "Not configured";

  return (
    <>
      <WaitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={ClockIcon}
        name="Wait"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

WaitNode.displayName = "WaitNode";
