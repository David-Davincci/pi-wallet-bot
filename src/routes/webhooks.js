const express = require('express');
const router = express.Router();
const { validateSignature } = require('../services/security');
const { handlePaymentEvent, handleTransactionEvent } = require('../bot/handlers');

router.post('/webhook', async (req, res) => {
  if (!validateSignature(req.body, req.headers['x-pi-signature'])) {
    return res.status(403).send('Invalid signature');
  }

  const event = req.body;
  try {
    switch(event.type) {
      case 'payment.created':
        await handlePaymentEvent(event);
        break;
      case 'transaction.pending_approval':
        await handleTransactionEvent(event);
        break;
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing event');
  }
});

module.exports = router;