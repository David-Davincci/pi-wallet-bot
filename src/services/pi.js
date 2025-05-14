import { Pi } from '@pinetwork-js/sdk';
import crypto from 'crypto';

export default class PiService {
  constructor() {
    this.pi = new Pi({
      apiKey: process.env.PI_API_KEY,
      secret: process.env.PI_API_SECRET,
      encryptionKey: process.env.ENCRYPTION_KEY
    });

    this.initializeSDK();
  }

  initializeSDK() {
    this.pi.configure({
      redirectUri: process.env.PI_REDIRECT_URI,
      scopes: ['payments', 'wallet'],
      onUserSession: this.handleUserSession
    });

    this.pi.enableSSO();
  }

  handleUserSession = (session) => {
    const encryptedSession = this.encryptSession(session);
    // Store session in database
    Database.saveSession(session.user.uid, encryptedSession);
  };

  encryptSession = (session) => {
    return this.pi.crypto.encrypt(
      JSON.stringify(session),
      process.env.ENCRYPTION_KEY
    );
  };

  decryptSession = (encryptedSession) => {
    return JSON.parse(
      this.pi.crypto.decrypt(encryptedSession, process.env.ENCRYPTION_KEY)
    );
  };

  async handlePaymentApproval(txId, approve) {
    const payment = await this.pi.getPayment(txId);
    return approve ? payment.approve() : payment.reject();
  }
}