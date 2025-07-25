import Waitlist from "../models/waitlist";
import { connectMongoDB } from "../lib/db";

export async function verifyWaitlistStatus(
  telegramId: number | undefined
): Promise<boolean> {
  connectMongoDB();

  const wl = await Waitlist.findOne({ tgId: telegramId });

  if (wl) return true;

  return false;
}

export async function retrieveUserId(
  telegramId: string
): Promise<string | 404> {
  connectMongoDB();

  const id = parseInt(telegramId);
  console.log({ id });

  const wl = await Waitlist.findOne({ tgId: id });
  // console.log({ wl });

  if (!wl) {
    console.log("none");
    return 404;
  }

  return wl.id.toLocaleString();
}

export async function setWebhook(botApi: string, webhookUrl: string) {
  try {
    const reqUrl = `https://api.telegram.org/bot${botApi}/setWebhook?url=${webhookUrl}`;

    const headers = {
      ContentType: "Application/json",
    };

    const webhook = await fetch(reqUrl, { headers });

    console.log({ status: await webhook.json() });

    return 200;
  } catch (error) {
    console.log(error);
    return 500;
  }
}
