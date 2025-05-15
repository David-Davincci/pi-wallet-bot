const { MESSAGES } = require('./constants');

module.exports = {
  formatTransactionMessage: (tx) => {
    return `⚠️ New Transaction Requires Approval\n\n` +
           `Wallet: ${tx.walletAddress}\n` +
           `Amount: ${tx.amount} π\n` +
           `Recipient: ${tx.recipient}\n` +
           `Memo: ${tx.memo || 'None'}\n` +
           `Time: ${tx.timestamp}\n\n` +
           `Approve or reject this transaction?`;
  },

  createInlineKeyboard: (txId) => {
    return {
      inline_keyboard: [
        [
          { text: '✅ Approve', callback_data: `approve-${txId}` },
          { text: '❌ Reject', callback_data: `reject-${txId}` }
        ]
      ]
    };
  },

  validateWalletAddress: (address) => {
    // Basic Pi wallet address validation
    return address && address.length === 56 && address.startsWith('G');
  },

  formatBalance: (balance) => {
    return parseFloat(balance).toFixed(6);
  },

  handleError: (ctx, error, customMessage) => {
    console.error(error);
    ctx.reply(customMessage || 'An error occurred. Please try again later.');
  }
};