import TelegramBot from 'node-telegram-bot-api';
import PiService from '../services/pi.js';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const piService = new PiService();

// Connect Wallet Command
bot.onText(/\/connect/, (msg) => {
  const authUrl = piService.pi.getAuthUrl();
  bot.sendMessage(msg.chat.id, `🔗 Connect your Pi Wallet:\n${authUrl}`);
});

// List Connected Wallets
bot.onText(/\/wallets/, async (msg) => {
  const wallets = await Database.getWallets(msg.chat.id);
  const message = wallets.map(w => 
    `💰 ${w.name}: ${w.balance} π\n${w.address.slice(0, 6)}...${w.address.slice(-4)}`
  ).join('\n\n');
  
  bot.sendMessage(msg.chat.id, `📒 Connected Wallets:\n\n${message}`);
});

// Transaction Approval Handler
bot.on('callback_query', async (query) => {
  const [action, txId] = query.data.split(':');
  try {
    const result = await piService.handlePaymentApproval(txId, action === 'approve');
    bot.answerCallbackQuery(query.id, { 
      text: `Transaction ${action}d successfully! ✅` 
    });
  } catch (error) {
    bot.answerCallbackQuery(query.id, { 
      text: 'Failed to process transaction ❌' 
    });
  }
});