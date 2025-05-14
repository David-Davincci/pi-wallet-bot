import { Pi } from '@pinetwork-js/sdk';
import crypto from 'crypto';

export class PiNetwork {
  constructor() {
    this.client = new Pi({
      apiKey: process.env.PI_API_KEY,
      secret: process.env.PI_API_SECRET
    });
  }

  getAuthUrl(telegramId) {
    return this.client.getAuthUrl({
      redirectUri: `${process.env.VERCEL_URL}/api/auth/callback`,
      scopes: ['username', 'payments', 'wallet'],
      state: telegramId.toString()
    });
  }

  async approvePayment(paymentId, accessToken) {
    return this.client.approvePayment(paymentId, { accessToken });
  }

  async rejectPayment(paymentId, accessToken) {
    return this.client.rejectPayment(paymentId, { accessToken });
  }

  encryptData(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv
    );
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decryptData(encryptedData) {
    const [iv, content] = encryptedData.split(':').map(part => Buffer.from(part, 'hex'));
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv
    );
    return Buffer.concat([decipher.update(content), decipher.final()]).toString();
  }
}