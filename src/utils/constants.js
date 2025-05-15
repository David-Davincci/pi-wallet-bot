module.exports = {
    PI_API_BASE_URL: 'https://api.minepi.com/v2',
    PI_WS_URL: 'wss://api.minepi.com/websocket',
    ALLOWED_CURRENCIES: ['PI'],
    TRANSACTION_STATUS: {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected'
    },
    MESSAGES: {
      INVALID_WALLET: 'Invalid wallet address or wallet not found on Pi Network',
      WALLET_CONNECTED: 'Wallet connected successfully!',
      WALLET_DISCONNECTED: 'Wallet disconnected successfully!',
      TX_APPROVED: 'Transaction approved and completed!',
      TX_REJECTED: 'Transaction rejected and cancelled!',
      TX_NOT_FOUND: 'Transaction not found',
      TX_ALREADY_PROCESSED: 'Transaction already processed',
      RECIPIENT_NOT_ALLOWED: 'Transaction rejected: Recipient not allowed'
    },
    COMMANDS: {
      START: 'Welcome to Pi Wallet Security Bot!',
      CONNECT_USAGE: 'Please provide a wallet address. Usage: /connect <wallet_address>',
      DISCONNECT_USAGE: 'Please provide a wallet address. Usage: /disconnect <wallet_address>',
      NO_WALLETS: 'No active wallets connected',
      WALLETS_LIST: 'Your connected wallets:'
    }
  };