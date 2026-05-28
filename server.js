const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

const storage = {};
const UTM_TTL_MS = 15 * 60 * 1000; // 15 минут

app.get('/', (req, res) => {
  res.send('Server works');
});

function cleanupOldUTM() {
  const now = Date.now();

  Object.keys(storage).forEach((id) => {
    const item = storage[id];

    if (now - item.createdAt > UTM_TTL_MS) {
      console.log('DELETE OLD UTM:', {
        id,
        utm_source: item.utm_source,
        age_ms: now - item.createdAt
      });

      delete storage[id];
    }
  });
}

app.post('/save', (req, res) => {
  cleanupOldUTM();

  const { utm_source } = req.body;

  if (!utm_source) {
    return res.status(400).send('No utm_source');
  }

  const id = Date.now().toString();

  storage[id] = {
    utm_source,
    createdAt: Date.now()
  };

  console.log('SAVED UTM:', {
    id,
    utm_source
  });

  res.json({ id });
});

app.get('/assign', (req, res) => {
  cleanupOldUTM();

  const order = req.query.order || 'no_order';
  const phone = req.query.phone || 'no_phone';
  const email = req.query.email || 'no_email';

  const entries = Object.entries(storage).sort((a, b) => {
    return a[1].createdAt - b[1].createdAt;
  });

  if (entries.length === 0) {
    console.log('ASSIGN: no utm found', {
      order,
      phone,
      email
    });

    return res.type('text/plain').send('unknown');
  }

  const [id, item] = entries[0];

  delete storage[id];

  console.log('ASSIGN FIFO UTM:', {
    utm_source: item.utm_source,
    order,
    phone,
    email,
    used_click_id: id
  });

  res.type('text/plain').send(item.utm_source);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
