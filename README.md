# The Open Labs Waitlist Telegram Bot

This document explains how the Telegram bot for The Open Labs waitlist application works. This bot allows users to interact with the waitlist directly through Telegram.

## What it Does

- Users can start a conversation with the bot by sending the /start command.
- The bot will greet the user and check if they are already on the waitlist.
- If the user is not on the waitlist, the bot will display a message inviting them to join and a button to do so.
- If the user is already on the waitlist, the bot will display a message with a button allowing them to check their points.

## API Overview

The bot uses the Telegram Bot API to communicate with Telegram. When a user interacts with the bot, the Telegram servers send a message to this application. The application then processes the message and responds to the user through the Telegram Bot API.

Here's a breakdown of the different parts of the application:

- **Express Server:** This is the main part of the application. It listens for incoming messages from Telegram and handles them.
- **Database:** The application uses a MongoDB database to store information about users on the waitlist. This includes their Telegram ID, name (optional), and waitlist points (optional).
- **Telegram Bot:** This is the interface that users interact with on Telegram. It allows users to send commands and receive messages from the bot.

This documentation doesn't include specific function implementations, but it should give you a good understanding of how the application works at a high level.

## Additional Notes

- This application requires environment variables to be set for the Telegram Bot API key, database URL, and application URL.
- The code uses helper functions to manage interactions with the database and generate messages for the bot.

I hope this documentation helps! Feel free to reach out to the development team if you have any questions
