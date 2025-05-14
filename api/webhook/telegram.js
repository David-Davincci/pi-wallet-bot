import { handleTelegramUpdate } from '../../lib/bot';

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await handleTelegramUpdate(req.body);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Update processing failed' });
  }
};