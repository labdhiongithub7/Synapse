"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { HashIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackMessageFormValues, SlackMessageDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { fetchSlackRealtimeToken } from "./actions";

type SlackMessageNodeData = {
  webhookUrl?: string;
  message?: string;
};

type SlackMessageNodeType = Node<SlackMessageNodeData>;

export const SlackMessageNode = memo((props: NodeProps<SlackMessageNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SlackMessageFormValues) => {
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
  const description = nodeData?.message
    ? "Message configured"
    : "Not configured";

  return (
    <>
      <SlackMessageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={HashIcon}
        name="Slack Message"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

SlackMessageNode.displayName = "SlackMessageNode";
