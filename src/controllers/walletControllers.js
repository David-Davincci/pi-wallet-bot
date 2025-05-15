const PiService = require('../services/piService');
const Wallet = require('../models/Wallet');
const { subscribeToWallet, unsubscribeFromWallet } = require('../services/websocketService');

exports.connectWallet = async (ctx) => {
  try {
    const walletAddress = ctx.message.text.split(' ')[1];
    
    if (!walletAddress) {
      return ctx.reply('Please provide a wallet address. Usage: /connect <wallet_address>');
    }
    
    // Verify wallet exists on Pi Network
    const walletInfo = await PiService.getWalletInfo(walletAddress);
    if (!walletInfo) {
      return ctx.reply('Invalid wallet address or wallet not found on Pi Network');
    }
    
    // Check if wallet already connected
    const existingWallet = await Wallet.findOne({ where: { walletAddress } });
    if (existingWallet) {
      if (existingWallet.userId !== ctx.from.id) {
        return ctx.reply('This wallet is already connected by another user');
      }
      if (existingWallet.isActive) {
        return ctx.reply('This wallet is already connected');
      }
      
      // Reactivate wallet
      await existingWallet.update({ isActive: true });
      subscribeToWallet(walletAddress);
      return ctx.reply(`Wallet ${walletAddress} reconnected successfully!`);
    }
    
    // Create new wallet connection
    const newWallet = await Wallet.create({
      userId: ctx.from.id,
      walletAddress,
      isActive: true
    });
    
    subscribeToWallet(walletAddress);
    ctx.reply(`Wallet ${walletAddress} connected successfully!`);
  } catch (error) {
    console.error(error);
    ctx.reply('An error occurred while connecting wallet');
  }
};

exports.disconnectWallet = async (ctx) => {
  try {
    const walletAddress = ctx.message.text.split(' ')[1];
    
    if (!walletAddress) {
      return ctx.reply('Please provide a wallet address. Usage: /disconnect <wallet_address>');
    }
    
    // Update wallet status
    const wallet = await Wallet.findOne({ 
      where: { 
        walletAddress, 
        userId: ctx.from.id 
      } 
    });
    
    if (!wallet) {
      return ctx.reply('Wallet not found or not connected by you');
    }
    
    await wallet.update({ isActive: false });
    unsubscribeFromWallet(walletAddress);
    ctx.reply(`Wallet ${walletAddress} disconnected successfully!`);
  } catch (error) {
    console.error(error);
    ctx.reply('An error occurred while disconnecting wallet');
  }
};

exports.listWallets = async (ctx) => {
  try {
    const wallets = await Wallet.findAll({ 
      where: { 
        userId: ctx.from.id, 
        isActive: true 
      } 
    });
    
    if (wallets.length === 0) {
      return ctx.reply('No active wallets connected');
    }
    
    let message = 'Your connected wallets:\n';
    wallets.forEach(wallet => {
      message += `- ${wallet.walletAddress}\n`;
    });
    
    ctx.reply(message);
  } catch (error) {
    console.error(error);
    ctx.reply('An error occurred while listing wallets');
  }
};