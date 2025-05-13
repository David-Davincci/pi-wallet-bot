const { decrypt } = require('../services/security');
const { resolveTransaction } = require('../services/pi-api');

module.exports.handleApproval = async (query) => {
  const [action, txId] = query.data.split('_');
  const tx = pendingApprovals[txId];

  if (!tx) {
    return bot.answerCallbackQuery(query.id, { text: 'Transaction expired' });
  }

  try {
    const wallet = connectedWallets[tx.account];
    await resolveTransaction(txId, action === 'approve', wallet);
    
    bot.editMessageText(`✅ Transaction ${action === 'approve' ? 'approved' : 'rejected'}`, {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id
    });
    
    delete pendingApprovals[txId];
  } catch (error) {
    console.error('Approval error:', error);
    bot.answerCallbackQuery(query.id, { text: 'Failed to process transaction' });
  }
};