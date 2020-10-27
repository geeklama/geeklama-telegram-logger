# Telegram logger
### Install package: `npm i geeklama-telegram-logger`
### Add to root project folder file config.json
```
{
  "logger": {
    "projectName": "name",
    "telegramApiUrl": "https://api.com",
    "botToken": "token",
    "channels": {
      "main": "channel_id",
      "development": "channel_id",
      "oherChannelName": "channel_id"
    }
  }
}
``` 
required fields:
- telegramApiUrl
- botToken
- channels.main and channels.development
