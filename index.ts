import express, { Express } from "express";
import { Bot, InlineKeyboard } from "grammy";
import { waitlistInvitation } from "./helpers/messages";
import { verifyWaitlistStatus } from "./helpers/queries";

const app: Express = express();
const port = process.env.PORT || 5000;

const botAPi = process.env.TELEGRAM_BOT_API as string;

let bot: Bot;

let isBotRunning = false;

function startBot() {
  if (!isBotRunning) {
    bot = new Bot(botAPi);
    isBotRunning = true;

    bot.start();
  }
}

startBot();

app.get("/webhook/set", async function (req: Request, res: Response) {
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

  const reqUrl = `https://api.telegram.org/bot${botAPi}/setWebhook?url=${webhookUrl}`;

  const headers = {
    ContentType: "Application/json",
  };

  const webhook = await fetch(reqUrl, { headers });

  console.log({ status: await webhook.json() });
  // console.log({ api: botAPi, url: reqUrl, whurl:webhookUrl})

  res.json({ status: 200 });
});

app.post("/bot", async function (req: Request, res: Response) {
  try {
    console.log("received");

    bot.command("start", async (ctx) => {
      const sender = ctx.from;
      console.log({ sender });

      const isJoinedWaitlist = await verifyWaitlistStatus(
        sender?.id.toLocaleString()!
      );

      const joinWaitlistMsg = await waitlistInvitation(
        sender?.id as unknown as string,
        sender?.first_name!
      );

      console.log({ joinWaitlistMsg });

      ctx.replyWithPhoto("https://i.ibb.co/0rgHwc2/IMG-3987.png", {
        caption: joinWaitlistMsg.message,
        reply_markup: new InlineKeyboard().webApp(
          isJoinedWaitlist ? "Check My Points ✨💎" : "Join Waitlist 🚀🚀🚀",
          isJoinedWaitlist
            ? joinWaitlistMsg.link.joined
            : joinWaitlistMsg.link.new
        ),
      });
    });
  } catch (error) {
    console.log("Error occurred while processing request", error);
  }
});

app.listen(port, async () => {
  console.log(`Listening on port: ${port}...`);
});
