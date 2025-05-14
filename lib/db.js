import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export async function saveUserSession({ telegramId, piAccessToken, piRefreshToken, piUserId }) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO user_sessions 
       (telegram_id, pi_access_token, pi_refresh_token, pi_user_id) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (telegram_id) 
       DO UPDATE SET 
         pi_access_token = $2,
         pi_refresh_token = $3,
         pi_user_id = $4,
         updated_at = NOW()`,
      [telegramId, piAccessToken, piRefreshToken, piUserId]
    );
  } finally {
    client.release();
  }
}

export async function getUserSession(telegramId) {
  const { rows } = await pool.query(
    `SELECT pi_access_token, pi_refresh_token, pi_user_id 
     FROM user_sessions 
     WHERE telegram_id = $1`,
    [telegramId]
  );
  return rows[0];
}

export async function getWalletsForUser(telegramId) {
  const { rows } = await pool.query(
    `SELECT w.address, w.username, w.balance
     FROM wallets w
     JOIN user_sessions u ON w.pi_user_id = u.pi_user_id
     WHERE u.telegram_id = $1`,
    [telegramId]
  );
  return rows;
}

export async function sendTelegramMessage(chatId, message) {
  // This would be called from webhooks to send messages
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
  return bot.sendMessage(chatId, message);
}