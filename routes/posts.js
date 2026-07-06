const express = require('express');
const router = express.Router();
const db = require('../db');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80) || 'post';
}

// Get all posts
router.get('/', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  res.json(posts);
});

// Get single post
router.get('/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Create post
router.post('/', (req, res) => {
  const { title, content, excerpt, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  let slug = slugify(title);
  const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);
  if (existing) slug += '-' + Date.now();

  const result = db.prepare('INSERT INTO posts (title, slug, content, excerpt, tags) VALUES (?, ?, ?, ?, ?)')
    .run(title, slug, content, excerpt || '', tags || '');
  res.json({ id: result.lastInsertRowid, slug });
});

// Update post
router.put('/:id', (req, res) => {
  const { title, content, excerpt, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const slug = slugify(title);
  db.prepare('UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(title, slug, content, excerpt || '', tags || '', req.params.id);
  res.json({ success: true, slug });
});

// Delete post
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
