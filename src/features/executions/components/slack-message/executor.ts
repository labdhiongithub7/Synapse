import type { NodeExecutor } from "@/features/executions/types";
import { SlackMessageFormValues } from "./dialog";
import { slackChannel } from "@/inngest/channels/slack";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import ky from "ky";

export const slackExecutor: NodeExecutor<SlackMessageFormValues> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const { webhookUrl, message } = data;

  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    const result = await step.run("slack", async () => {
      if (!webhookUrl) {
        throw new NonRetriableError("Slack node: Webhook URL is required");
      }
      if (!message) {
        throw new NonRetriableError("Slack node: Message is required");
      }

      // Compile templates
      const urlTemplate = Handlebars.compile(webhookUrl);
      const resolvedUrl = urlTemplate(context);

      const messageTemplate = Handlebars.compile(message);
      const resolvedMessage = messageTemplate(context);

      // Send slack message
      await ky.post(resolvedUrl, {
        json: {
          text: resolvedMessage,
        },
      });

      return context;
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
