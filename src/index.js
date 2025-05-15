require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const { initializeDb } = require('./services/dbService');
const { initializeWebSocket } = require('./services/websocketService');
const walletController = require('./controllers/walletController');
const transactionController = require('./controllers/transactionController');

// Initialize database and WebSocket
(async () => {
  await initializeDb();
  await initializeWebSocket(bot);
})();

// Bot commands
bot.start((ctx) => ctx.reply('Welcome to Pi Wallet Security Bot!'));
bot.command('connect', walletController.connectWallet);
bot.command('disconnect', walletController.disconnectWallet);
bot.command('list', walletController.listWallets);
bot.action(/approve-.*/, transactionController.approveTransaction);
bot.action(/reject-.*/, transactionController.rejectTransaction);

// Start bot
bot.launch();

// Vercel handler
module.exports = (req, res) => {
  bot.handleUpdate(req.body, res);
};