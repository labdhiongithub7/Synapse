import { NodeExecutor } from "@/features/executions/types";
import { telegramMessageChannel } from "@/inngest/channels/telegram";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { CredentialType } from "@/generated/prisma";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import ky from "ky";

export const telegramMessageExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(telegramMessageChannel().status({
    nodeId,
    status: "loading",
  }));

  try {
    const credential = await step.run("get-telegram-credential", async () => {
      const cred = await prisma.credential.findFirst({
        where: {
          userId,
          type: CredentialType.TELEGRAM,
        },
      });

      if (!cred) {
        throw new NonRetriableError("Telegram credential not found");
      }

      return {
        ...cred,
        value: decrypt(cred.value),
      };
    });

    const template = Handlebars.compile(data.message as string);
    const resolvedMessage = template(context);
    const chatId = data.chatId as string;

    if (!chatId) {
      throw new NonRetriableError("Chat ID is required for Telegram node");
    }

    await step.run("send-telegram-message", async () => {
      try {
        await ky.post(`https://api.telegram.org/bot${credential.value}/sendMessage`, {
          json: {
            chat_id: chatId,
            text: resolvedMessage,
          },
        });
      } catch (error) {
        throw new Error(`Failed to send Telegram message: ${(error as Error).message}`);
      }
    });

    await publish(telegramMessageChannel().status({
      nodeId,
      status: "success",
    }));

    return context;
  } catch (error) {
    await publish(telegramMessageChannel().status({
      nodeId,
      status: "error",
    }));
    throw error;
  }
};
