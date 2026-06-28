import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { AiTextGenerationNode } from "@/features/executions/components/ai-text-generation/node";
import { DiscordMessageNode } from "@/features/executions/components/discord-message/node";
import { SlackMessageNode } from "@/features/executions/components/slack-message/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.OPENAI]: AiTextGenerationNode,
  [NodeType.DISCORD]: DiscordMessageNode,
  [NodeType.SLACK]: SlackMessageNode,
  [NodeType.GEMINI]: InitialNode, // Stubs for schema compatibility
  [NodeType.ANTHROPIC]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
