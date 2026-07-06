const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  res.json(todos);
});

router.post('/', (req, res) => {
  const { subject, task, due_date } = req.body;
  if (!subject || !task) return res.status(400).json({ error: 'Subject and task required' });
  const result = db.prepare('INSERT INTO todos (subject, task, due_date) VALUES (?, ?, ?)')
    .run(subject, task, due_date || null);
  res.json({ id: result.lastInsertRowid });
});

router.patch('/:id/toggle', (req, res) => {
  const todo = db.prepare('SELECT completed FROM todos WHERE id = ?').get(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(todo.completed ? 0 : 1, req.params.id);
  res.json({ completed: !todo.completed });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
