interface ChanelType {
    main: string;
    development: string;
    [key: string]: string;
}
declare class TelegramService {
    private static readonly isProduction;
    private static botToken;
    private static telegramApiUrl;
    private static projectName;
    private static channels;
    static sendMessage(message: any, chatType?: keyof ChanelType): Promise<void>;
    private static setConfiguration;
    private static parseError;
    private static stripTags;
}
export default TelegramService;
