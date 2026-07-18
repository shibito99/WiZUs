// Mock data initialization — runs once per session
(function () {
  if (sessionStorage.getItem('wizus_initialized')) return;

  const now = Date.now();
  const ago = (min) => new Date(now - min * 60000).toISOString();

  const users = [
    { id: 1, username: 'alice', email: 'alice@example.com', password: 'password123', bio: 'Hello, I\'m Alice! 🎉 Frontend developer and coffee lover.', avatar_color: '#1d9bf0', avatar_url: null, created_at: ago(10000) },
    { id: 2, username: 'bob', email: 'bob@example.com', password: 'password123', bio: 'Bob here! Building cool things with code. ☕', avatar_color: '#f4212e', avatar_url: null, created_at: ago(9000) },
    { id: 3, username: 'charlie', email: 'charlie@example.com', password: 'password123', bio: 'Just a dev. JavaScript enthusiast. 🟨', avatar_color: '#00ba7c', avatar_url: null, created_at: ago(8000) },
    { id: 4, username: 'diana', email: 'diana@example.com', password: 'password123', bio: 'Designer & creator. Making things beautiful. 🎨', avatar_color: '#ff7700', avatar_url: null, created_at: ago(7000) },
    { id: 5, username: 'eve', email: 'eve@example.com', password: 'password123', bio: 'Tech enthusiast. Always learning something new! 🚀', avatar_color: '#794bc4', avatar_url: null, created_at: ago(6000) },
  ];

  const posts = [
    { id: 1, user_id: 2, content: 'Just deployed my first Spring Boot app! 🚀 It feels amazing when everything works.', image_url: null, created_at: ago(5) },
    { id: 2, user_id: 3, content: 'Anyone else spending their Sunday debugging CSS? 😅 The struggle is real. #webdev', image_url: null, created_at: ago(30) },
    { id: 3, user_id: 1, content: 'WiZUs はついにローンチ！🎉 ベータに参加してくれた皆さん、ありがとう！一緒にアイデアをシェアしましょう！', image_url: null, created_at: ago(60) },
    { id: 4, user_id: 4, content: '新しいデザインシステムが完成しました。クリーン、ミニマル、そしてアクセシブルです。どう思いますか？ 🎨', image_url: null, created_at: ago(90) },
    { id: 5, user_id: 2, content: 'Hot take: タブ派 vs スペース派 どっちが正義？ 😤', image_url: null, created_at: ago(120) },
    { id: 6, user_id: 5, content: 'JWT 認証のベストプラクティスを読んでいます。セキュリティは本当に重要！ 🔒', image_url: null, created_at: ago(180) },
    { id: 7, user_id: 3, content: 'ペアプログラミングセッションが驚くほど生産的でした。二人の頭は一つより優れている！ 💡', image_url: null, created_at: ago(240) },
    { id: 8, user_id: 4, content: 'タイポグラフィはほとんどの開発者が思うより重要です。ユーザーは気づいています、たとえ言葉にできなくても。', image_url: null, created_at: ago(300) },
    { id: 9, user_id: 1, content: 'Tailwind CSS を勉強中。ユーティリティファーストのアプローチがだんだん好きになってきた！ 🌀', image_url: null, created_at: ago(360) },
    { id: 10, user_id: 5, content: 'MySQL クエリ最適化の日。EXPLAIN はあなたの親友です。 📊', image_url: null, created_at: ago(420) },
  ];

  const likes = [
    { user_id: 1, post_id: 1 },
    { user_id: 1, post_id: 4 },
    { user_id: 2, post_id: 3 },
    { user_id: 3, post_id: 1 },
    { user_id: 3, post_id: 3 },
    { user_id: 4, post_id: 5 },
    { user_id: 5, post_id: 3 },
    { user_id: 2, post_id: 6 },
    { user_id: 1, post_id: 7 },
  ];

  const comments = [
    { id: 1, post_id: 1, user_id: 1, parent_comment_id: null, content: 'おめでとう Bob！どんなスタック使ったの？', created_at: ago(3) },
    { id: 2, post_id: 1, user_id: 3, parent_comment_id: null, content: 'すごい！Spring Boot は最高ですよね。', created_at: ago(2) },
    { id: 3, post_id: 1, user_id: 2, parent_comment_id: 1, content: 'Spring Boot + MySQL + React です！ありがとう Alice 😊', created_at: ago(1) },
    { id: 4, post_id: 3, user_id: 2, parent_comment_id: null, content: 'ローンチおめでとう！🎉', created_at: ago(55) },
    { id: 5, post_id: 3, user_id: 4, parent_comment_id: null, content: 'ベータに参加できて嬉しいです！', created_at: ago(50) },
    { id: 6, post_id: 5, user_id: 1, parent_comment_id: null, content: 'スペース派！圧倒的に 😂', created_at: ago(110) },
    { id: 7, post_id: 5, user_id: 3, parent_comment_id: 6, content: '同意！スペースは絶対正義', created_at: ago(100) },
  ];

  const follows = [
    { follower_id: 1, followee_id: 2 },
    { follower_id: 1, followee_id: 3 },
    { follower_id: 2, followee_id: 1 },
    { follower_id: 2, followee_id: 4 },
    { follower_id: 3, followee_id: 1 },
    { follower_id: 3, followee_id: 5 },
    { follower_id: 4, followee_id: 2 },
    { follower_id: 5, followee_id: 1 },
  ];

  sessionStorage.setItem('wizus_users', JSON.stringify(users));
  sessionStorage.setItem('wizus_posts', JSON.stringify(posts));
  sessionStorage.setItem('wizus_likes', JSON.stringify(likes));
  sessionStorage.setItem('wizus_comments', JSON.stringify(comments));
  sessionStorage.setItem('wizus_follows', JSON.stringify(follows));
  sessionStorage.setItem('wizus_next_user_id', '6');
  sessionStorage.setItem('wizus_next_post_id', '11');
  sessionStorage.setItem('wizus_next_comment_id', '8');
  sessionStorage.setItem('wizus_initialized', 'true');
})();
