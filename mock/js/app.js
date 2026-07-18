// ── Data accessors ──────────────────────────────────────────────────────────
function getUsers()    { return JSON.parse(sessionStorage.getItem('wizus_users') || '[]'); }
function getPosts()    { return JSON.parse(sessionStorage.getItem('wizus_posts') || '[]'); }
function getLikes()    { return JSON.parse(sessionStorage.getItem('wizus_likes') || '[]'); }
function getComments() { return JSON.parse(sessionStorage.getItem('wizus_comments') || '[]'); }
function getFollows()  { return JSON.parse(sessionStorage.getItem('wizus_follows') || '[]'); }

function saveUsers(v)    { sessionStorage.setItem('wizus_users', JSON.stringify(v)); }
function savePosts(v)    { sessionStorage.setItem('wizus_posts', JSON.stringify(v)); }
function saveLikes(v)    { sessionStorage.setItem('wizus_likes', JSON.stringify(v)); }
function saveComments(v) { sessionStorage.setItem('wizus_comments', JSON.stringify(v)); }
function saveFollows(v)  { sessionStorage.setItem('wizus_follows', JSON.stringify(v)); }

function getUser(id) { return getUsers().find(u => u.id === id) || null; }

function nextId(key) {
  const n = parseInt(sessionStorage.getItem(key) || '1');
  sessionStorage.setItem(key, String(n + 1));
  return n;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function getCurrentUserId() {
  const v = sessionStorage.getItem('wizus_current_user_id');
  return v ? parseInt(v) : null;
}
function getCurrentUser() {
  const id = getCurrentUserId();
  return id ? getUser(id) : null;
}
function requireAuth() {
  if (!getCurrentUserId()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
function logout() {
  sessionStorage.removeItem('wizus_current_user_id');
  window.location.href = 'login.html';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'たった今';
  if (min < 60) return `${min}分前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

function avatarHTML(user, size = 40) {
  const fs = Math.round(size * 0.42);
  if (user && user.avatar_url) {
    return `<img src="${user.avatar_url}" class="rounded-full object-cover flex-shrink-0" style="width:${size}px;height:${size}px;" alt="${escHtml(user.username)}">`;
  }
  const initial = user ? user.username[0].toUpperCase() : '?';
  const color = (user && user.avatar_color) ? user.avatar_color : '#1d9bf0';
  return `<div class="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style="width:${size}px;height:${size}px;background:${color};font-size:${fs}px;">${initial}</div>`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Follow helpers ────────────────────────────────────────────────────────────
function isFollowing(followerId, followeeId) {
  return getFollows().some(f => f.follower_id === followerId && f.followee_id === followeeId);
}
function toggleFollow(followerId, followeeId) {
  let follows = getFollows();
  const idx = follows.findIndex(f => f.follower_id === followerId && f.followee_id === followeeId);
  if (idx === -1) {
    follows.push({ follower_id: followerId, followee_id: followeeId });
  } else {
    follows.splice(idx, 1);
  }
  saveFollows(follows);
  return idx === -1; // true = now following
}
function followingCount(userId) {
  return getFollows().filter(f => f.follower_id === userId).length;
}
function followerCount(userId) {
  return getFollows().filter(f => f.followee_id === userId).length;
}

// ── Like helpers ──────────────────────────────────────────────────────────────
function isLiked(userId, postId) {
  return getLikes().some(l => l.user_id === userId && l.post_id === postId);
}
function toggleLike(userId, postId) {
  let likes = getLikes();
  const idx = likes.findIndex(l => l.user_id === userId && l.post_id === postId);
  if (idx === -1) { likes.push({ user_id: userId, post_id: postId }); }
  else { likes.splice(idx, 1); }
  saveLikes(likes);
  return idx === -1;
}
function likeCount(postId) {
  return getLikes().filter(l => l.post_id === postId).length;
}

// ── Comment helpers ───────────────────────────────────────────────────────────
function topComments(postId) {
  return getComments().filter(c => c.post_id === postId && !c.parent_comment_id)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
function replies(commentId) {
  return getComments().filter(c => c.parent_comment_id === commentId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
function commentCount(postId) {
  return getComments().filter(c => c.post_id === postId).length;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function renderNavbar() {
  const cu = getCurrentUser();
  const el = document.getElementById('navbar');
  if (!el) return;
  el.innerHTML = `
    <nav class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <a href="index.html" class="text-xl font-extrabold tracking-tight" style="color:#1d9bf0">WiZUs</a>
        <div class="flex items-center gap-2">
          <a href="search.html" class="p-2 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition" title="検索">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
          </a>
          <a href="new-post.html" class="text-white text-sm font-semibold px-4 py-1.5 rounded-full transition" style="background:#1d9bf0" onmouseover="this.style.background='#1a8cd8'" onmouseout="this.style.background='#1d9bf0'">投稿する</a>
          <a href="profile.html?id=${cu ? cu.id : ''}" class="flex items-center gap-1.5 ml-1">
            ${cu ? avatarHTML(cu, 32) : ''}
            <span class="text-sm font-medium text-gray-700 hidden sm:inline">${cu ? escHtml(cu.username) : ''}</span>
          </a>
          <button onclick="logout()" class="text-xs text-gray-400 hover:text-gray-600 ml-1 transition">ログアウト</button>
        </div>
      </div>
    </nav>`;
}

// ── Comment Modal ─────────────────────────────────────────────────────────────
function openCommentModal(postId) {
  const cu = getCurrentUser();
  if (!cu) return;
  const post = getPosts().find(p => p.id === postId);
  if (!post) return;
  const author = getUser(post.user_id);

  function buildCommentHTML(c) {
    const u = getUser(c.user_id);
    const reps = replies(c.id);
    return `
      <div class="py-3 border-b border-gray-100 last:border-0" id="comment-${c.id}">
        <div class="flex gap-2">
          <a href="profile.html?id=${u.id}">${avatarHTML(u, 32)}</a>
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-1">
              <a href="profile.html?id=${u.id}" class="font-semibold text-sm hover:underline">${escHtml(u.username)}</a>
              <span class="text-xs text-gray-400">${relativeTime(c.created_at)}</span>
              ${c.user_id === cu.id ? `<button onclick="deleteComment(${c.id})" class="ml-auto text-xs text-red-400 hover:text-red-600">削除</button>` : ''}
            </div>
            <p class="text-sm text-gray-800 mt-0.5">${escHtml(c.content)}</p>
            <button onclick="toggleReplyForm(${c.id})" class="text-xs text-blue-500 hover:underline mt-1">返信</button>
            <div id="reply-form-${c.id}" class="hidden mt-2">
              <div class="flex gap-2">
                ${avatarHTML(cu, 24)}
                <input type="text" id="reply-input-${c.id}" placeholder="返信を入力..." class="flex-1 border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-blue-400">
                <button onclick="submitReply(${postId}, ${c.id})" class="text-sm font-semibold px-3 py-1 rounded-full text-white" style="background:#1d9bf0">返信</button>
              </div>
            </div>
            ${reps.map(r => {
              const ru = getUser(r.user_id);
              return `
                <div class="flex gap-2 mt-2 pl-4 border-l-2 border-gray-100" id="comment-${r.id}">
                  <a href="profile.html?id=${ru.id}">${avatarHTML(ru, 24)}</a>
                  <div class="flex-1">
                    <div class="flex items-baseline gap-1">
                      <a href="profile.html?id=${ru.id}" class="font-semibold text-xs hover:underline">${escHtml(ru.username)}</a>
                      <span class="text-xs text-gray-400">${relativeTime(r.created_at)}</span>
                      ${r.user_id === cu.id ? `<button onclick="deleteComment(${r.id})" class="ml-auto text-xs text-red-400 hover:text-red-600">削除</button>` : ''}
                    </div>
                    <p class="text-xs text-gray-800 mt-0.5">${escHtml(r.content)}</p>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }

  const overlay = document.createElement('div');
  overlay.id = 'comment-modal-overlay';
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4';
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 class="font-bold text-lg">コメント</h2>
        <button onclick="closeCommentModal()" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>
      <!-- original post -->
      <div class="px-4 py-3 border-b border-gray-100 flex gap-3">
        <a href="profile.html?id=${author.id}">${avatarHTML(author, 36)}</a>
        <div>
          <span class="font-semibold text-sm">${escHtml(author.username)}</span>
          <p class="text-sm text-gray-700 mt-0.5">${escHtml(post.content)}</p>
        </div>
      </div>
      <!-- comments list -->
      <div id="comments-list" class="flex-1 overflow-y-auto px-4">${topComments(postId).map(buildCommentHTML).join('') || '<p class="py-8 text-center text-gray-400 text-sm">まだコメントはありません</p>'}</div>
      <!-- new comment form -->
      <div class="px-4 py-3 border-t border-gray-100 flex gap-2">
        ${avatarHTML(cu, 32)}
        <input type="text" id="new-comment-input" placeholder="コメントを追加..." class="flex-1 border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-blue-400">
        <button onclick="submitComment(${postId})" class="text-sm font-semibold px-4 py-1.5 rounded-full text-white" style="background:#1d9bf0">送信</button>
      </div>
    </div>`;
  overlay.addEventListener('click', closeCommentModal);
  document.body.appendChild(overlay);
}

function closeCommentModal() {
  const el = document.getElementById('comment-modal-overlay');
  if (el) el.remove();
}

function toggleReplyForm(commentId) {
  const el = document.getElementById(`reply-form-${commentId}`);
  if (el) el.classList.toggle('hidden');
}

function submitComment(postId) {
  const cu = getCurrentUser();
  const input = document.getElementById('new-comment-input');
  const text = input.value.trim();
  if (!text) return;
  const comment = { id: nextId('wizus_next_comment_id'), post_id: postId, user_id: cu.id, parent_comment_id: null, content: text, created_at: new Date().toISOString() };
  const comments = getComments();
  comments.push(comment);
  saveComments(comments);
  input.value = '';
  // refresh modal
  closeCommentModal();
  openCommentModal(postId);
  // update count in feed if present
  const countEl = document.getElementById(`comment-count-${postId}`);
  if (countEl) countEl.textContent = commentCount(postId);
}

function submitReply(postId, parentId) {
  const cu = getCurrentUser();
  const input = document.getElementById(`reply-input-${parentId}`);
  const text = input.value.trim();
  if (!text) return;
  const comment = { id: nextId('wizus_next_comment_id'), post_id: postId, user_id: cu.id, parent_comment_id: parentId, content: text, created_at: new Date().toISOString() };
  const comments = getComments();
  comments.push(comment);
  saveComments(comments);
  closeCommentModal();
  openCommentModal(postId);
  const countEl = document.getElementById(`comment-count-${postId}`);
  if (countEl) countEl.textContent = commentCount(postId);
}

function deleteComment(commentId) {
  const cu = getCurrentUser();
  let comments = getComments();
  const c = comments.find(x => x.id === commentId);
  if (!c || c.user_id !== cu.id) return;
  // also remove replies
  comments = comments.filter(x => x.id !== commentId && x.parent_comment_id !== commentId);
  saveComments(comments);
  const el = document.getElementById(`comment-${commentId}`);
  if (el) el.remove();
}

// ── PostCard renderer ─────────────────────────────────────────────────────────
function renderPostCard(post) {
  const cu = getCurrentUser();
  const author = getUser(post.user_id);
  if (!author) return '';
  const liked = cu ? isLiked(cu.id, post.id) : false;
  const lc = likeCount(post.id);
  const cc = commentCount(post.id);
  const isOwn = cu && cu.id === post.user_id;

  return `
    <article class="border-b border-gray-100 px-4 py-4 hover:bg-gray-50 transition">
      <div class="flex gap-3">
        <a href="profile.html?id=${author.id}" class="flex-shrink-0">${avatarHTML(author, 44)}</a>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <a href="profile.html?id=${author.id}" class="font-bold text-sm hover:underline">${escHtml(author.username)}</a>
            <span class="text-xs text-gray-400">${relativeTime(post.created_at)}</span>
            ${isOwn ? `<button onclick="deletePost(${post.id})" class="ml-auto text-xs text-gray-300 hover:text-red-500 transition" title="削除">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>` : ''}
          </div>
          <p class="text-sm text-gray-900 mt-1 whitespace-pre-wrap break-words">${escHtml(post.content)}</p>
          ${post.image_url ? `<img src="${post.image_url}" class="mt-2 rounded-xl max-h-72 w-full object-cover border border-gray-100" alt="投稿画像">` : ''}
          <div class="flex items-center gap-5 mt-3">
            <!-- like -->
            <button onclick="handleLike(${post.id}, this)" class="flex items-center gap-1.5 text-sm group ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition" data-liked="${liked}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="${liked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span id="like-count-${post.id}">${lc}</span>
            </button>
            <!-- comment -->
            <button onclick="openCommentModal(${post.id})" class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span id="comment-count-${post.id}">${cc}</span>
            </button>
          </div>
        </div>
      </div>
    </article>`;
}

function handleLike(postId, btn) {
  const cu = getCurrentUser();
  if (!cu) return;
  const nowLiked = toggleLike(cu.id, postId);
  const icon = btn.querySelector('svg');
  const count = document.getElementById(`like-count-${postId}`);
  icon.setAttribute('fill', nowLiked ? 'currentColor' : 'none');
  btn.dataset.liked = nowLiked;
  btn.className = btn.className.replace(/text-(red|gray)-\d+/, nowLiked ? 'text-red-500' : 'text-gray-400');
  if (count) count.textContent = likeCount(postId);
}

function deletePost(postId) {
  if (!confirm('この投稿を削除しますか？')) return;
  const cu = getCurrentUser();
  let posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post || post.user_id !== cu.id) return;
  savePosts(posts.filter(p => p.id !== postId));
  const el = document.querySelector(`[data-post-id="${postId}"]`) || document.getElementById(`post-${postId}`);
  if (el) { el.remove(); return; }
  // fallback: reload
  const article = document.querySelector(`article button[onclick="deletePost(${postId})"]`)?.closest('article');
  if (article) article.remove();
}

// ── UserCard renderer ─────────────────────────────────────────────────────────
function renderUserCard(user) {
  const cu = getCurrentUser();
  if (!cu) return '';
  const isSelf = cu.id === user.id;
  const following = isFollowing(cu.id, user.id);
  return `
    <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition">
      <a href="profile.html?id=${user.id}" class="flex-shrink-0">${avatarHTML(user, 44)}</a>
      <div class="flex-1 min-w-0">
        <a href="profile.html?id=${user.id}" class="font-bold text-sm hover:underline block">${escHtml(user.username)}</a>
        ${user.bio ? `<p class="text-xs text-gray-500 truncate">${escHtml(user.bio)}</p>` : ''}
      </div>
      ${!isSelf ? `<button onclick="handleFollowBtn(${user.id}, this)" class="follow-btn flex-shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full border transition ${following ? 'bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-500' : 'text-white border-transparent'}" style="${following ? '' : 'background:#1d9bf0'}" data-following="${following}">${following ? 'フォロー中' : 'フォロー'}</button>` : ''}
    </div>`;
}

function handleFollowBtn(targetId, btn) {
  const cu = getCurrentUser();
  if (!cu) return;
  const nowFollowing = toggleFollow(cu.id, targetId);
  btn.dataset.following = nowFollowing;
  btn.textContent = nowFollowing ? 'フォロー中' : 'フォロー';
  if (nowFollowing) {
    btn.className = btn.className.replace('text-white', '');
    btn.style.background = '';
    btn.classList.add('bg-white', 'border-gray-300', 'text-gray-700');
    btn.onmouseover = () => { btn.classList.add('border-red-300', 'text-red-500'); btn.classList.remove('text-gray-700'); };
    btn.onmouseout = () => { btn.classList.remove('border-red-300', 'text-red-500'); btn.classList.add('text-gray-700'); };
  } else {
    btn.style.background = '#1d9bf0';
    btn.classList.remove('bg-white', 'border-gray-300', 'text-gray-700', 'border-red-300', 'text-red-500');
    btn.classList.add('text-white');
    btn.onmouseover = null;
    btn.onmouseout = null;
  }
}
