import express from 'express';
import PiService from '../services/pi.js';

const router = express.Router();
const piService = new PiService();

router.post('/pi-webhook', async (req, res) => {
  try {
    const verified = piService.pi.verifyWebhookSignature(req);
    if (!verified) return res.status(403).send('Invalid signature');

    const event = req.body;
    switch(event.type) {
      case 'payment_approval':
        await handlePaymentApproval(event);
        break;
      case 'balance_update':
        await handleBalanceUpdate(event);
        break;
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Server error');
  }
});

async function handlePaymentApproval(event) {
  const user = await Database.getUserByAddress(event.payment.from_address);
  
  bot.sendMessage(user.chatId, `
⚠️ Payment Approval Required
──────────────
Amount: ${event.payment.amount} π
To: ${event.payment.to_address.slice(0, 6)}...${event.payment.to_address.slice(-4)}
Memo: ${event.payment.memo || 'None'}
──────────────
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve:${event.payment.id}` },
          { text: "❌ Reject", callback_data: `reject:${event.payment.id}` }
        ]
      ]
    }
  });
}