const express = require('express');
const cors = require('cors');
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'Aspire Careers backend' });
});

app.use('/api/jobs', jobsRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
