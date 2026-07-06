const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const milestones = db.prepare('SELECT * FROM milestones ORDER BY created_at ASC').all();
  res.json(milestones);
});

router.post('/', (req, res) => {
  const { title, target, color } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const result = db.prepare('INSERT INTO milestones (title, progress, target, color) VALUES (?, 0, ?, ?)')
    .run(title, parseInt(target) || 100, color || '#00f0ff');
  res.json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { progress } = req.body;
  db.prepare('UPDATE milestones SET progress = ? WHERE id = ?').run(progress, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM milestones WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
