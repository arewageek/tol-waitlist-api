import express, { Express} from 'express'
import {Bot, InlineKeyboard} from 'grammy'
import {waitlistInvitation} from './helpers/messages'


const app:Express = express()
const port = process.env.PORT || 5000

const botAPi = process.env.TELEGRAM_BOT_API as string

const bot = new Bot(botAPi)

app.get('/', async function (req: Request, res: Response) {
    res.json({status: 'success'});
});

app.get('/webhook/set', async function (req: Request, res: Response) {
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    const reqUrl = `https://api.telegram.org/bot${botAPi}/setWebhook?url=${webhookUrl}`;

    const headers = {
      ContentType: "Application/json",
    };

    const webhook = await fetch(reqUrl, { headers })

    // console.log({status: await webhook.json()})
    // console.log({ api: botAPi, url: reqUrl, whurl:webhookUrl})

    res.json({status: 200})
})

app.post('/bot', async function (req: Request, res: Response){
    console.log('received')

    bot.command("start", async ctx => {
        const sender:{id: number, is_bot: boolean, first_name: string, username: string, language_code: string} = ctx.from
        console.log({sender})

        const joinWaitlistMsg = await waitlistInvitation(sender.id, sender.first_name)
        // console.log({joinWaitlistMsg})

        ctx.replyWithPhoto('https://pintu-academy.pintukripto.com/wp-content/uploads/2023/12/Ton.png', {
            caption: joinWaitlistMsg.message,
            reply_markup: new InlineKeyboard().webApp("Join Waitlist 🚀🚀", process.env.APP_URL!)
        })
    })

    bot.start()
})

app.listen(port, async () => {
    console.log(`Listening on port: ${port}...`)
})