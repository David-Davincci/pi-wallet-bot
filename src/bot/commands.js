module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
      const helpText = `🔐 *Pi Wallet Guard*\n
      /connect - Connect new wallet
      /wallets - List connected wallets
      /balance [name] - Check balance
      /activateguard [name] - Enable protection
      /deactivateguard [name] - Disable protection
      /transactions [name] - View recent transactions
      /disconnect [name] - Remove wallet`;
      
      bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
    });
  
    bot.onText(/\/connect/, async (msg) => {
      const state = generateRandomString(20);
      pendingOAuthStates[msg.chat.id] = state;
      
      const authUrl = `https://minepi.com/oauth/authorize?client_id=${process.env.PI_API_KEY}` +
        `&redirect_uri=${process.env.REDIRECT_URI}&state=${state}`;
      
      bot.sendMessage(msg.chat.id, `🔗 Connect your Pi wallet:\n${authUrl}`);
    });
  };