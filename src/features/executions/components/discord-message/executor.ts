import type { NodeExecutor } from "@/features/executions/types";
import { DiscordMessageFormValues } from "./dialog";
import { discordChannel } from "@/inngest/channels/discord";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import ky from "ky";

export const discordExecutor: NodeExecutor<DiscordMessageFormValues> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const { webhookUrl, message } = data;

  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    const result = await step.run("discord", async () => {
      if (!webhookUrl) {
        throw new NonRetriableError("Discord node: Webhook URL is required");
      }
      if (!message) {
        throw new NonRetriableError("Discord node: Message is required");
      }

      // Compile templates
      const urlTemplate = Handlebars.compile(webhookUrl);
      const resolvedUrl = urlTemplate(context);

      const messageTemplate = Handlebars.compile(message);
      const resolvedMessage = messageTemplate(context);

      // Send discord message
      await ky.post(resolvedUrl, {
        json: {
          content: resolvedMessage,
        },
      });

      return context;
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
