/* ========================================
   Kyai — Admin Panel JS
   CRUD for Posts, Todos, Milestones
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPostEditor();
  initTodoManager();
  initMilestoneManager();
  initAdminAnimations();
});

// ─── Tab Switching ──────────────────────────────────
function initTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
      if (panel) {
        panel.classList.add('active');
        anime({
          targets: panel,
          translateY: [10, 0],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutExpo',
        });
      }
    });
  });
}

// ─── Post Editor ────────────────────────────────────
function initPostEditor() {
  const newBtn = document.getElementById('newPostBtn');
  const editor = document.getElementById('postEditor');
  const cancelBtn = document.getElementById('cancelPostBtn');
  const saveBtn = document.getElementById('savePostBtn');
  const titleInput = document.getElementById('postTitle');
  const contentInput = document.getElementById('postContent');
  const tagsInput = document.getElementById('postTags');
  const excerptInput = document.getElementById('postExcerpt');
  const editIdInput = document.getElementById('editPostId');

  function showEditor(post) {
    editor.style.display = 'flex';
    anime({
      targets: editor,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
    });
    if (post) {
      titleInput.value = post.title;
      contentInput.value = post.content;
      tagsInput.value = post.tags || '';
      excerptInput.value = post.excerpt || '';
      editIdInput.value = post.id;
    } else {
      titleInput.value = '';
      contentInput.value = '';
      tagsInput.value = '';
      excerptInput.value = '';
      editIdInput.value = '';
    }
  }

  function hideEditor() {
    anime({
      targets: editor,
      translateY: [0, -20],
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInExpo',
      complete: () => { editor.style.display = 'none'; }
    });
  }

  newBtn?.addEventListener('click', () => showEditor());
  cancelBtn?.addEventListener('click', hideEditor);

  saveBtn?.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) {
      shakeElement(saveBtn);
      return;
    }

    const body = {
      title,
      content,
      tags: tagsInput.value.trim(),
      excerpt: excerptInput.value.trim(),
    };

    const id = editIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/posts/${id}` : '/api/posts';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        hideEditor();
        location.reload();
      }
    } catch (err) {
      console.error('Save post failed:', err);
    }
  });

  // Edit buttons
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = btn.closest('tr');
      const slug = row.dataset.slug;
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const post = await res.json();
          showEditor(post);
        }
      } catch (err) {
        console.error('Fetch post failed:', err);
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.del-post-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('确定删除这篇文章？')) return;
      const row = btn.closest('tr');
      const id = row.dataset.id;
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
          anime({
            targets: row,
            translateX: [0, 50],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInExpo',
            complete: () => row.remove(),
          });
        }
      } catch (err) {
        console.error('Delete post failed:', err);
      }
    });
  });
}

// ─── Todo Manager ───────────────────────────────────
function initTodoManager() {
  const addBtn = document.getElementById('addTodoBtn');
  const subjectSelect = document.getElementById('todoSubject');
  const taskInput = document.getElementById('todoTask');
  const dateInput = document.getElementById('todoDate');

  addBtn?.addEventListener('click', async () => {
    const subject = subjectSelect.value;
    const task = taskInput.value.trim();
    if (!task) { shakeElement(taskInput); return; }

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, task, due_date: dateInput.value || null }),
      });
      if (res.ok) {
        taskInput.value = '';
        location.reload();
      }
    } catch (err) {
      console.error('Add todo failed:', err);
    }
  });

  // Checkbox toggle
  document.querySelectorAll('.todo-check').forEach(cb => {
    cb.addEventListener('change', async () => {
      const row = cb.closest('tr');
      const id = row.dataset.id;
      try {
        const res = await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
        if (res.ok) {
          const data = await res.json();
          if (data.completed) {
            row.classList.add('todo-done');
          } else {
            row.classList.remove('todo-done');
          }
        }
      } catch (err) {
        console.error('Toggle todo failed:', err);
      }
    });
  });

  // Delete todo
  document.querySelectorAll('.del-todo-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = btn.closest('tr');
      const id = row.dataset.id;
      try {
        const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          anime({
            targets: row,
            translateX: [0, 50],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInExpo',
            complete: () => row.remove(),
          });
        }
      } catch (err) {
        console.error('Delete todo failed:', err);
      }
    });
  });

  // Enter key to add todo
  taskInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn?.click();
  });
}

// ─── Milestone Manager ──────────────────────────────
function initMilestoneManager() {
  const addBtn = document.getElementById('addMilestoneBtn');
  const titleInput = document.getElementById('milestoneTitle');
  const targetInput = document.getElementById('milestoneTarget');
  const colorInput = document.getElementById('milestoneColor');

  // Add milestone
  addBtn?.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    if (!title) { shakeElement(titleInput); return; }
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          target: parseInt(targetInput.value) || 100,
          color: colorInput.value || '#00f0ff',
        }),
      });
      if (res.ok) {
        titleInput.value = '';
        location.reload();
      }
    } catch (err) {
      console.error('Add milestone failed:', err);
    }
  });

  titleInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn?.click();
  });

  // Progress slider
  document.querySelectorAll('.progress-slider').forEach(slider => {
    slider.addEventListener('input', () => {
      const valEl = slider.nextElementSibling;
      if (valEl) valEl.textContent = slider.value + '%';
    });

    slider.addEventListener('change', async () => {
      const id = slider.dataset.id;
      const progress = parseInt(slider.value);
      try {
        await fetch(`/api/milestones/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress }),
        });
      } catch (err) {
        console.error('Update milestone failed:', err);
      }
    });
  });

  // Delete milestone
  document.querySelectorAll('.del-milestone-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('确定删除这个进度？')) return;
      const row = btn.closest('tr');
      const id = row.dataset.id;
      try {
        const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
        if (res.ok) {
          anime({
            targets: row,
            translateX: [0, 50],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInExpo',
            complete: () => row.remove(),
          });
        }
      } catch (err) {
        console.error('Delete milestone failed:', err);
      }
    });
  });
}

// ─── Admin Entrance Animation ───────────────────────
function initAdminAnimations() {
  anime({
    targets: '.admin-table tbody tr',
    translateX: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(40, { start: 200 }),
    duration: 500,
    easing: 'easeOutExpo',
  });
}

// ─── Utility: Shake element on error ───────────────
function shakeElement(el) {
  anime({
    targets: el,
    translateX: [0, -8, 8, -6, 6, -3, 3, 0],
    duration: 500,
    easing: 'easeInOutSine',
  });
}
