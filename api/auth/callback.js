import { Pi } from '@pinetwork-js/sdk';
import { saveUserSession } from '../../lib/db';

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { code, state: telegramId } = req.query;
    
    const pi = new Pi({
      apiKey: process.env.PI_API_KEY,
      secret: process.env.PI_API_SECRET
    });

    const { access_token, refresh_token, user } = await pi.getTokens(code);
    
    await saveUserSession({
      telegramId,
      piAccessToken: access_token,
      piRefreshToken: refresh_token,
      piUserId: user.uid
    });

    res.redirect(`https://t.me/${process.env.BOT_USERNAME}?start=success`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`https://t.me/${process.env.BOT_USERNAME}?start=error`);
  }
};