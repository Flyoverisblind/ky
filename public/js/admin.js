/* ========================================
   Kyai — Admin Panel JS
   CRUD for Posts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPostEditor();
  initAdminAnimations();
});

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

    const body = { title, content, tags: tagsInput.value.trim(), excerpt: excerptInput.value.trim() };
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
