import type { NodeExecutor } from "@/features/executions/types";
import { AiTextGenerationFormValues } from "./dialog";
import { openAiChannel } from "@/inngest/channels/openai";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

export const aiTextGenerationExecutor: NodeExecutor<AiTextGenerationFormValues> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const { variableName, prompt, credentialId } = data;

  await publish(
    openAiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    const result = await step.run("openai", async () => {
      if (!prompt) {
        throw new NonRetriableError("OpenAI node: Prompt is required");
      }
      if (!credentialId) {
        throw new NonRetriableError("OpenAI node: Credential is required");
      }
      if (!variableName) {
        throw new NonRetriableError("OpenAI node: Variable name is required");
      }

      // Load credential
      const credential = await prisma.credential.findUnique({
        where: { id: credentialId },
      });

      if (!credential) {
        throw new NonRetriableError("OpenAI node: Credential not found");
      }

      const apiKey = decrypt(credential.value);

      // Compile template
      const template = Handlebars.compile(prompt);
      const resolvedPrompt = template(context);

      const openai = createOpenAI({
        apiKey,
      });

      const { text } = await generateText({
        // @ts-expect-error - AI SDK version mismatch between ai and @ai-sdk/openai
        model: openai("gpt-4o-mini"),
        prompt: resolvedPrompt,
      });

      return {
        ...context,
        [variableName]: text,
      };
    });

    await publish(
      openAiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
