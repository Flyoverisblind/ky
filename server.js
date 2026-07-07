const express = require('express');
const path = require('path');
const marked = require('marked');

const db = require('./db');
const postsRouter = require('./routes/posts');
const todosRouter = require('./routes/todos');
const milestonesRouter = require('./routes/milestones');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Markdown helper
marked.setOptions({ breaks: true, gfm: true });
app.locals.marked = marked;

app.use('/api/posts', postsRouter);
app.use('/api/todos', todosRouter);
app.use('/api/milestones', milestonesRouter);

// ==================== Frontend Routes ====================

app.get('/', (req, res) => {
  const milestones = db.prepare('SELECT * FROM milestones ORDER BY created_at ASC').all();
  const exams = db.prepare('SELECT * FROM exam_dates ORDER BY exam_date ASC').all();
  const todos = db.prepare('SELECT subject, COUNT(*) as total, SUM(completed) as done FROM todos GROUP BY subject').all();
  const recentPosts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT 3').all();
  res.render('home', { milestones, exams, todos, recentPosts });
});

app.get('/blog', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const tag = req.query.tag || '';
  const limit = 6;
  const offset = (page - 1) * limit;

  let total, posts;
  if (tag) {
    total = db.prepare("SELECT COUNT(*) as count FROM posts WHERE INSTR(tags, ?) > 0").get(tag).count;
    posts = db.prepare("SELECT * FROM posts WHERE INSTR(tags, ?) > 0 ORDER BY created_at DESC LIMIT ? OFFSET ?").all(tag, limit, offset);
  } else {
    total = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
    posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
  }
  const totalPages = Math.ceil(total / limit);

  // Compute tag cloud
  const allRows = db.prepare("SELECT tags FROM posts").all();
  const tagCounts = {};
  allRows.forEach(row => {
    if (!row.tags) return;
    row.tags.split(',').forEach(t => {
      const trimmed = t.trim();
      if (trimmed) tagCounts[trimmed] = (tagCounts[trimmed] || 0) + 1;
    });
  });
  const tagsArr = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));

  res.render('blog', { posts, currentPage: page, totalPages, tags: tagsArr, activeTag: tag });
});

app.get('/blog/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
  if (!post) return res.status(404).render('404');
  res.render('post', { post });
});

app.get('/admin', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  const milestones = db.prepare('SELECT * FROM milestones ORDER BY created_at ASC').all();
  res.render('admin', { posts, todos, milestones });
});

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Kyai server running on http://localhost:${PORT}`);
});
