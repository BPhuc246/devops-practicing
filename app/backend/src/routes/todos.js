import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create todo
router.post('/', async (req, res) => {
  const VALID_PRIORITIES = ['low', 'medium', 'high'];
  const { title, priority = 'medium' } = req.body;
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO todos (title, priority) VALUES ($1, $2) RETURNING *',
      [title.trim(), priority],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle completed
router.patch('/:id/toggle', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { rows } = await pool.query(
      `UPDATE todos
       SET completed = NOT completed, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const VALID_PRIORITIES = ['low', 'medium', 'high'];
  const { title, priority = 'medium' } = req.body;
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE todos SET title = $1, priority = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [title.trim(), priority, id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all completed
router.delete('/completed/all', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM todos WHERE completed = TRUE');
    res.json({ message: `Deleted ${rowCount} completed todos` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', todo: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
