const crypto = require('crypto');
const { createCipheriv, createDecipheriv } = require('crypto');

const IV_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

exports.validateSignature = (body, signature) => {
  const hmac = crypto.createHmac('sha256', process.env.PI_API_SECRET);
  hmac.update(JSON.stringify(body));
  const digest = hmac.digest('hex');
  return digest === signature;
};

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = (text) => {
  const [ivPart, encryptedPart] = text.split(':');
  const iv = Buffer.from(ivPart, 'hex');
  const encrypted = Buffer.from(encryptedPart, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};