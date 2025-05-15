const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

class TelegramService {
  static async sendMessage(chatId, message, keyboard = null) {
    try {
      const options = keyboard ? { reply_markup: keyboard } : {};
      await bot.telegram.sendMessage(chatId, message, options);
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }
}

module.exports = TelegramService;