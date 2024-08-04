import Waitlist from '../models/waitlist'
import {connectMongoDB} from '../lib/db'

export async function verifyWaitlistStatus(telegramId: string): Promise<boolean> {
    connectMongoDB()

    const wl = await Waitlist.findOne({ tgId: telegramId })

    if(wl) return true;

    return false;
}

export async function retrieveUserId(telegramId: string): Promise <string | 404> {
    connectMongoDB()

    const wl = await Waitlist.findOne({ tgId: telegramId })

    if(!wl) return 404

    return wl.id;
}