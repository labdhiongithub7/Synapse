"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { TelegramMessageFormValues, TelegramMessageDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchTelegramMessageRealtimeToken } from "./actions";
import { TELEGRAM_MESSAGE_CHANNEL_NAME } from "@/inngest/channels/telegram";

type TelegramMessageNodeData = {
  chatId?: string;
  message?: string;
};

type TelegramMessageNodeType = Node<TelegramMessageNodeData>;

export const TelegramMessageNode = memo((props: NodeProps<TelegramMessageNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: TELEGRAM_MESSAGE_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchTelegramMessageRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: TelegramMessageFormValues) => {
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
      <TelegramMessageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/telegram.svg"
        name="Telegram"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

TelegramMessageNode.displayName = "TelegramMessageNode";
