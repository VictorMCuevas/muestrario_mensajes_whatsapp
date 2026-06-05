const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// GET webhook (verificación)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// POST webhook (mensajes)
app.post('/webhook', (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages) {
    for (const msg of messages) {
      console.log('Mensaje recibido:', {
        from: msg.from,
        message: msg.text?.body || '',
        timestamp: msg.timestamp
      });
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
