const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server works');
});

const storage = {};
app.get('/save-testvk', (req, res) => {
  const id = Date.now().toString();

  storage[id] = {
    utm_source: 'testvk',
    createdAt: Date.now()
  };

  console.log('SAVE TESTVK:', storage[id]);

  res.json({ id: id, saved: storage[id] });
});
app.get('/testsave', (req, res) => {
  const id = Date.now().toString();

  storage[id] = {
    utm_source: 'testvk',
    createdAt: Date.now()
  };

  console.log('TEST SAVED:', storage[id]);

  res.json({ id: id, saved: storage[id] });
});
app.post('/save', (req, res) => {
  const { utm_source } = req.body;

  if (!utm_source) {
    return res.status(400).send('No utm_source');
  }

  const id = Date.now().toString();

  storage[id] = {
    utm_source,
    createdAt: Date.now()
  };

  console.log('Saved:', storage[id]);

  res.json({ id });
});
app.get('/assign', (req, res) => {
  const order = req.query.order || 'no_order';
  const phone = req.query.phone || 'no_phone';
  const email = req.query.email || 'no_email';

  const items = Object.values(storage);

  if (items.length === 0) {
    console.log('ASSIGN: no utm found', {
      order,
      phone,
      email
    });

    return res.type('text/plain').send('unknown');
  }

  const last = items[items.length - 1];

  console.log('ASSIGN UTM:', {
    utm_source: last.utm_source,
    order,
    phone,
    email
  });

  res.type('text/plain').send(last.utm_source);
});

  const last = items[items.length - 1];

  console.log('ASSIGN UTM:', last.utm_source);

  res.type('text/plain').send(last.utm_source);
});
app.listen(3000, () => {
  console.log('Server started');
});
