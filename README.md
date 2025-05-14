# Pi Wallet Telegram Bot

A secure bot for managing Pi Network wallets via Telegram with transaction approval flow.

## Features
- Connect multiple Pi wallets
- Approve/reject transactions via Telegram
- Real-time balance monitoring
- Secure encryption for all sensitive data

## Setup
1. Set environment variables:
   ```bash
   TELEGRAM_TOKEN=7338023246:AAHXS32Lt6SJnZs7JqklUIbSjZ5hMvf_2fM
   PI_API_KEY=2akdi0g0w1dzqcpcedmdemomgtuo40tdkt3ghmhjc0tel5q9ia7ebdxnghpcmilc
   PI_API_SECRET=SCWGYK7BUMIKRIGYNEQFV3WBIMDYN75HV24CRBTKFUXFABD75MIUWHX2
   ENCRYPTION_KEY=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
   BOT_USERNAME=PiWalletMonitorBot
   POSTGRES_URL=POSTGRES_URL="postgres://postgres.hjkzlureefvckuumbbgx:G02s0SbphwRGnYIC@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
   ```

2. Deploy to Vercel:
   ```bash
   vercel deploy --prod
   ```

3. Configure Pi Developer Portal:
   - Webhook: `https://.vercel.app/api/webhooks/pi`
   - Redirect URI: `https://your-app.vercel.app/api/auth/callback`

## Database Schema
Run the initial migration:
```sql
CREATE TABLE user_sessions (
  telegram_id BIGINT PRIMARY KEY,
  pi_access_token TEXT NOT NULL,
  pi_refresh_token TEXT NOT NULL,
  pi_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
  pi_user_id TEXT REFERENCES user_sessions(pi_user_id),
  address TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  balance DECIMAL(18,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```