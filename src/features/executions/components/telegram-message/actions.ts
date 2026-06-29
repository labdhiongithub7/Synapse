"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { telegramMessageChannel } from "@/inngest/channels/telegram";
import { inngest } from "@/inngest/client";

export type TelegramToken = Realtime.Token<
  typeof telegramMessageChannel,
  ["status"]
>;

export async function fetchTelegramMessageRealtimeToken(): Promise<TelegramToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: telegramMessageChannel(),
    topics: ["status"],
  });

  return token;
};
