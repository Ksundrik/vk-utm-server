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

app.listen(3000, () => {
  console.log('Server started');
});
