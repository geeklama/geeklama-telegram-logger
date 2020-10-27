import axios from 'axios';
import {readFileSync} from 'fs';

interface ChanelType {
  main: string;
  development: string;
  [key: string]: string;
}

class TelegramService {
  private static readonly isProduction: boolean = process.env.ENV === 'prod';
  private static botToken: string;
  private static telegramApiUrl: string;
  private static projectName = 'dev';
  private static channels: ChanelType;

  static async sendMessage(message: any, chatType: keyof ChanelType = 'main') {
    if (!this.channels) {
      this.setConfiguration();
    }
    let chatId = this.channels[chatType];

    if (!this.isProduction) {
      chatId = this.channels.development;
    }
    if (message instanceof Error) {
      message = this.parseError(message);
    }

    let project = this.projectName;

    if (!this.isProduction) {
      project = 'dev';
    }

    axios.post(
      `${this.telegramApiUrl}${this.botToken}/${project}`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }
    );
  }

  private static setConfiguration() {
    const config = JSON.parse(readFileSync('./config.json') as any);
    const loggerConfig = config.logger;
    if (!loggerConfig) {
      throw new Error('logger field in config.json not found.');
    }

    if (!loggerConfig.botToken || !loggerConfig.telegramApiUrl) {
      throw new Error('logger.botToken or logger.telegramApiUrl field in config.json not found.');
    }

    if (!loggerConfig.channels || !loggerConfig?.channels.development || !loggerConfig?.channels.main) {
      throw new Error('logger.channels.development or channels.development.main field in config.json not found.');
    }

    this.botToken = loggerConfig.botToken;
    this.telegramApiUrl = loggerConfig.telegramApiUrl;
    this.projectName = loggerConfig.projectName || this.projectName;
    this.channels = loggerConfig.channels;
  }

  private static parseError(exception: Error) {
    const exceptionTrace =  exception.stack || '';
    const exceptionMessage =  exception.message || '';
    const exceptionType = exception.name || '';
    const exceptionToString = exception.toString();
    return `<b>ExceptionType</b>: ${this.stripTags(exceptionType)}
<b>ExceptionMessage</b>: ${this.stripTags(exceptionMessage)}
<b>ExceptionTrace</b>: ${this.stripTags(exceptionTrace)}
<b>ExceptionToString</b>: ${this.stripTags(exceptionToString)}`;
  }

  private static stripTags(text: string) {
    if (typeof text === 'string') {
      return text.replace(/(<([^>]+)>)/gi, '');
    }

    return text;
  }
}

export default TelegramService;
