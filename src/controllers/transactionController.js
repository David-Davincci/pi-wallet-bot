const PiService = require('../services/piService');
const Transaction = require('../models/Transaction');

exports.approveTransaction = async (ctx) => {
  try {
    const transactionId = ctx.match[0].split('-')[1];
    const transaction = await Transaction.findByPk(transactionId);
    
    if (!transaction) {
      return ctx.answerCbQuery('Transaction not found');
    }
    
    if (transaction.status !== 'pending') {
      return ctx.answerCbQuery('Transaction already processed');
    }
    
    // Check if recipient is allowed
    if (transaction.recipient !== process.env.ALLOWED_WALLET_ADDRESS) {
      await ctx.editMessageText(`Transaction rejected: Recipient not allowed`);
      await ctx.answerCbQuery('Recipient not allowed');
      return await PiService.rejectTransaction(transaction.walletAddress, transaction.txId);
    }
    
    // Approve transaction
    const result = await PiService.approveTransaction(
      transaction.walletAddress,
      transaction.txId
    );
    
    if (result.success) {
      await ctx.editMessageText(`Transaction approved and completed!`);
      await ctx.answerCbQuery('Transaction approved');
    } else {
      await ctx.editMessageText(`Failed to approve transaction: ${result.error}`);
      await ctx.answerCbQuery('Approval failed');
    }
  } catch (error) {
    console.error(error);
    ctx.answerCbQuery('An error occurred');
  }
};

exports.rejectTransaction = async (ctx) => {
  try {
    const transactionId = ctx.match[0].split('-')[1];
    const transaction = await Transaction.findByPk(transactionId);
    
    if (!transaction) {
      return ctx.answerCbQuery('Transaction not found');
    }
    
    if (transaction.status !== 'pending') {
      return ctx.answerCbQuery('Transaction already processed');
    }
    
    // Reject transaction
    const result = await PiService.rejectTransaction(
      transaction.walletAddress,
      transaction.txId
    );
    
    if (result.success) {
      await ctx.editMessageText(`Transaction rejected and cancelled!`);
      await ctx.answerCbQuery('Transaction rejected');
    } else {
      await ctx.editMessageText(`Failed to reject transaction: ${result.error}`);
      await ctx.answerCbQuery('Rejection failed');
    }
  } catch (error) {
    console.error(error);
    ctx.answerCbQuery('An error occurred');
  }
};