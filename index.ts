import express, { type Express } from "express";
import { Bot, InlineKeyboard } from "grammy";
import { run } from "@grammyjs/runner";
import { waitlistInvitation } from "./helpers/messages";
import { setWebhook, verifyWaitlistStatus } from "./helpers/queries";

const app: Express = express();
const port = process.env.PORT || 5000;

const botAPi = process.env.TELEGRAM_BOT_API as string;
const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL!;

// let bot: Bot;

// let isBotRunning = false;

// function startBot() {
//   if (!isBotRunning) {
//     bot = new Bot(botAPi);
//     bot.stop();
//     bot.start();

//     isBotRunning = true;
//   }
// }

// startBot();

const bot = new Bot(process.env.TELEGRAM_BOT_API!);

app.use(express.json());

app.get("/keep-alive", async function (req, res) {
  console.log("Bot kept alive");

  const url = `https://api.telegram.org/bot${botAPi}/getWebhookInfo`;
  try {
    const verifyWebhook = await fetch(url);
    if (verifyWebhook.ok) {
      const data = await verifyWebhook.json();

      const response = {
        status: 200,
        message: "Webhook verification successful",
        data,
      };

      if (data.result.url != "") {
        const response = await bot.api.deleteWebhook();
        console.log({ webhookeRemovalStatus: response });
        return res.json({ webhookRemovalStatus: response });
      }

      return res.json({ response });
    } else {
      const response = { status: 400, message: "Webhook verification failed" };
      console.log({ response });
      return res.json({ response });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "An error occurred while verifying bot's webhook url",
    });
  }

  return res.json({ status: 200 });
});

app.get("/webhook/verify", async function (req, res) {
  const url = `https://api.telegram.org/bot${botAPi}/getWebhookInfo`;
  try {
    const verifyWebhook = await fetch(url);
    if (verifyWebhook.ok) {
      const data = await verifyWebhook.json();

      const response = {
        status: 200,
        message: "Webhook verification successful",
        data,
      };

      if (data.result.url == "") {
        const set = await setWebhook(botAPi, webhookUrl);
        console.log(set);
        return res.json(set);
      }

      console.log({ response });

      console.log({ url: data.result.url });
      return res.json({ response });
    } else {
      const response = { status: 400, message: "Webhook verification failed" };
      console.log({ response });
      return res.json({ response });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "An error occurred while verifying bot's webhook url",
    });
  }
});

app.get("/webhook/set", async function (req, res) {
  const response = await setWebhook(botAPi, webhookUrl);
  return res.json({ status: response });
});

app.get("/webhook/delete", async function (req, res) {
  try {
    const response = await bot.api.deleteWebhook();
    console.log({ status: await response });
    return res.json({ status: 200 });
  } catch (error) {
    console.log({ error });
    return res.json({ status: 500 });
  }
});

// app.post("/bot", async function (req, res) {
try {
  // bot.stop();
  console.log("received");

  bot.command("start", async (ctx) => {
    const sender = ctx.from;

    const isJoinedWaitlist = await verifyWaitlistStatus(
      sender?.id.toLocaleString()!
    );

    const joinWaitlistMsg = await waitlistInvitation(
      sender?.id as unknown as string,
      sender?.first_name!
    );

    const chatId = ctx.chat.id;
    console.log({ chatId });

    bot.api.sendPhoto(chatId, "https://i.ibb.co/0rgHwc2/IMG-3987.png", {
      caption: joinWaitlistMsg.message,
      reply_markup: new InlineKeyboard().webApp(
        isJoinedWaitlist ? "Check My Points ✨💎" : "Join Waitlist 🚀🚀🚀",
        isJoinedWaitlist
          ? joinWaitlistMsg.link.joined
          : joinWaitlistMsg.link.new
      ),
    });
  });
  // bot.start();
} catch (error) {
  console.log("Error occurred while processing request", error);
  bot.stop();
} finally {
  // bot.stop();
  console.log({ bot: true });
}
// });

run(bot);

app.listen(port, async () => {
  console.log(`Listening on port: ${port}...`);
});
