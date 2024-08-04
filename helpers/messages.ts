import {retrieveUserId} from './queries'

export async function waitlistInvitation (id: number, first_name: string): Promise<{message: string, waitlistLink: {new: string, joined: string}}>{

    const userId = await retrieveUserId(id)

    const message = `Hey, it's great to have you here ${first_name}. \n \nOur waitlist is currently on. You can join to stay in the loop for any updates on this project. \n \nYou also earn some reward reserved for our early adopters. \n\nUse the button below to get in`
    const link = {
        new: `${process.env.APP_URL}/join/${id}`,
        joined: `${process.env.APP_URL}/waitlist/${userId}`
    }

    return {message, link}
}