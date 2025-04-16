# WhatsApp Business to Telegram Forwarder PWA

A Progressive Web App (PWA) that monitors WhatsApp Business notifications and forwards new customer phone numbers to a Telegram group using a bot API.


## Features

- Reads WhatsApp Business notifications (Android only)
- Detects new customer messages
- Extracts phone numbers from notifications
- Forwards numbers to Telegram via bot API
- Works offline (PWA capabilities)
- Configurable Telegram settings

## Prerequisites

- Android device (for notification access)
- Telegram bot token (get from [@BotFather](https://t.me/BotFather))
- Telegram group chat ID

## Setup Instructions

### 1. Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Note down your bot token (format: `123456789:ABCdefGHIJKlmNoPQRsTuVWxyZ`)
3. Add the bot to your Telegram group as admin
4. Get your group chat ID (send a message to the group and visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`)

### 2. Android Configuration

1. Install this PWA on your Android device:
   - Open the deployed URL in Chrome
   - Tap "Add to Home Screen"
2. Enable notification access:
   - Go to Settings > Apps > Special app access > Notification access
   - Enable access for this app

### 3. App Configuration

1. Open the installed app
2. Enter your:
   - Telegram Bot Token
   - Telegram Chat ID
3. Click "Save Configuration"
4. Test the connection with "Test Telegram Bot" button



