import { Pi } from '@pinetwork-js/sdk';
import { sendTelegramMessage, getUserByPiId } from '../../lib/db';

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const pi = new Pi({
    apiKey: process.env.PI_API_KEY,
    secret: process.env.PI_API_SECRET
  });

  // Verify webhook signature
  if (!pi.verifyWebhookSignature(req)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  const { type, payment } = req.body;

  try {
    if (type === 'payment_approval') {
      const user = await getUserByPiId(payment.from_uid);
      
      if (user) {
        await sendTelegramMessage(user.telegramId, {
          text: `🔄 Payment Request\n\nAmount: ${payment.amount} π\nMemo: ${payment.memo || 'None'}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Approve", callback_data: `approve:${payment.identifier}` },
                { text: "❌ Reject", callback_data: `reject:${payment.identifier}` }
              ]
            ]
          }
        });
      }
    }

    res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
};