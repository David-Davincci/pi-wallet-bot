const axios = require('axios');
const { subscribeToWallet, unsubscribeFromWallet } = require('./websocketService');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

class PiService {
  static async getWalletInfo(walletAddress) {
    try {
      const response = await axios.get(`https://api.minepi.com/v2/accounts/${walletAddress}`, {
        headers: {
          'Authorization': `Key ${process.env.PI_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting wallet info:', error);
      return null;
    }
  }

  static async notifyForApproval(transaction, userId, bot) {
    try {
      const wallet = await Wallet.findOne({ where: { walletAddress: transaction.walletAddress } });
      
      if (!wallet) return;

      const message = `⚠️ New Transaction Requires Approval\n\n` +
                     `Wallet: ${transaction.walletAddress}\n` +
                     `Amount: ${transaction.amount} π\n` +
                     `Recipient: ${transaction.recipient}\n` +
                     `Memo: ${transaction.memo || 'None'}\n` +
                     `Time: ${transaction.timestamp}\n\n` +
                     `Approve or reject this transaction?`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve-${transaction.id}` },
            { text: '❌ Reject', callback_data: `reject-${transaction.id}` }
          ]
        ]
      };

      await bot.telegram.sendMessage(userId, message, { reply_markup: keyboard });
    } catch (error) {
      console.error('Error notifying for approval:', error);
    }
  }

  static async approveTransaction(walletAddress, txId) {
    try {
      const response = await axios.post(`https://api.minepi.com/v2/payments/${txId}/approve`, {}, {
        headers: {
          'Authorization': `Key ${process.env.PI_API_KEY}`
        }
      });
      
      await Transaction.update(
        { status: 'approved', processedAt: new Date() },
        { where: { txId } }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error approving transaction:', error);
      return { success: false, error: error.message };
    }
  }

  static async rejectTransaction(walletAddress, txId) {
    try {
      const response = await axios.post(`https://api.minepi.com/v2/payments/${txId}/reject`, {}, {
        headers: {
          'Authorization': `Key ${process.env.PI_API_KEY}`
        }
      });
      
      await Transaction.update(
        { status: 'rejected', processedAt: new Date() },
        { where: { txId } }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = PiService;