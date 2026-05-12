import express from 'express';
import { initDB } from './db';
import todosRouter from './routes/todos';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/todos', todosRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gobal exceptional error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
