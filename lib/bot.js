import TelegramBot from 'node-telegram-bot-api';
import { PiNetwork } from './pi';
import { 
  getUserSession,
  saveUserSession,
  getWalletsForUser 
} from './db';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const pi = new PiNetwork();

export async function handleTelegramUpdate(update) {
  if (update.message) {
    await handleMessage(update.message);
  } else if (update.callback_query) {
    await handleCallback(update.callback_query);
  }
}

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';

  try {
    if (text.startsWith('/start')) {
      await bot.sendMessage(chatId, 'Welcome to Pi Wallet Bot! Use /connect to link your wallet.');
    } 
    else if (text.startsWith('/connect')) {
      const authUrl = pi.getAuthUrl(chatId);
      await bot.sendMessage(chatId, `🔗 Connect your Pi wallet:\n${authUrl}`);
    }
    else if (text.startsWith('/wallets')) {
      const wallets = await getWalletsForUser(chatId);
      if (wallets.length === 0) {
        return await bot.sendMessage(chatId, 'No wallets connected. Use /connect first.');
      }
      
      const message = wallets.map(w => 
        `💰 ${w.username}\nBalance: ${w.balance} π\nAddress: ${w.address.slice(0, 6)}...${w.address.slice(-4)}`
      ).join('\n\n');
      
      await bot.sendMessage(chatId, `Your Wallets:\n\n${message}`);
    }
  } catch (error) {
    console.error('Message handling error:', error);
    await bot.sendMessage(chatId, '⚠️ An error occurred. Please try again.');
  }
}

async function handleCallback(callbackQuery) {
  const [action, paymentId] = callbackQuery.data.split(':');
  const chatId = callbackQuery.message.chat.id;

  try {
    const session = await getUserSession(chatId);
    if (!session?.piAccessToken) {
      return await bot.answerCallbackQuery(callbackQuery.id, { 
        text: 'Session expired. Please reconnect your wallet.' 
      });
    }

    if (action === 'approve') {
      await pi.approvePayment(paymentId, session.piAccessToken);
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Payment approved!' });
    } else {
      await pi.rejectPayment(paymentId, session.piAccessToken);
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Payment rejected!' });
    }

    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id
      }
    );
  } catch (error) {
    console.error('Callback handling error:', error);
    await bot.answerCallbackQuery(callbackQuery.id, { 
      text: 'Failed to process payment' 
    });
  }
}