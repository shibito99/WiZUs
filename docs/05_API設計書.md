# API 設計書

**プロジェクト:** TextSNS
**作成日:** 2026-07-11
**ベース URL:** `http://localhost:8080`（開発）/ `https://api.textsns.example.com`（本番）

---

## 1. 共通仕様

### リクエストヘッダー

| ヘッダー | 値 | 必須 |
|---------|----|------|
| Content-Type | `application/json` または `multipart/form-data` | ○ |
| Authorization | `Bearer <JWT>` | 認証が必要なエンドポイントのみ |

### レスポンス形式

- 成功: HTTP 200 / 201 / 204 + JSON ボディ
- エラー: HTTP 4xx / 5xx + `{ "error": "メッセージ" }`

### 共通エラーコード

| HTTP ステータス | 意味 |
|---------------|------|
| 400 | リクエスト不正（バリデーションエラー等） |
| 401 | 未認証（JWT なし・期限切れ） |
| 403 | 権限なし（他人のリソースへの操作） |
| 404 | リソースが見つからない |
| 409 | 競合（メール重複等） |

---

## 2. 認証 API

### POST `/api/auth/register` — ユーザー登録

**認証:** 不要

**リクエスト:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**レスポンス `200 OK`:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "avatarUrl": null,
    "bio": null,
    "followingCount": 0,
    "followerCount": 0,
    "createdAt": "2026-07-11T10:00:00"
  }
}
```

---

### POST `/api/auth/login` — ログイン

**認証:** 不要

**リクエスト:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**レスポンス `200 OK`:** `register` と同じ形式

---

## 3. 投稿 API

### GET `/api/posts` — タイムライン取得

**認証:** 必要

**クエリパラメータ:**
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | int | 0 | ページ番号（0始まり） |
| size | int | 20 | 1ページの件数 |

**レスポンス `200 OK`:**
```json
{
  "content": [
    {
      "id": 42,
      "userId": 3,
      "username": "jane",
      "avatarUrl": "https://bucket.s3.ap-northeast-1.amazonaws.com/avatars/...",
      "content": "こんにちは！",
      "imageUrl": null,
      "likeCount": 5,
      "commentCount": 2,
      "likedByMe": false,
      "createdAt": "2026-07-11T09:30:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

---

### POST `/api/posts` — 投稿作成

**認証:** 必要
**Content-Type:** `multipart/form-data`

**リクエストフォーム:**
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| content | string | ○ | 本文（最大280文字） |
| image | file | — | 画像ファイル（JPEG/PNG, 10MB 以下） |

**レスポンス `200 OK`:** PostResponse（上記と同じ形式、単一オブジェクト）

---

### DELETE `/api/posts/{id}` — 投稿削除

**認証:** 必要（自分の投稿のみ）

**レスポンス `204 No Content`**

---

## 4. いいね API

### POST `/api/posts/{id}/likes` — いいね

**認証:** 必要

**レスポンス `200 OK`:**
```json
{ "likeCount": 6 }
```

---

### DELETE `/api/posts/{id}/likes` — いいね取り消し

**認証:** 必要

**レスポンス `200 OK`:**
```json
{ "likeCount": 5 }
```

---

## 5. コメント・返信 API

### GET `/api/posts/{id}/comments` — コメント一覧

**認証:** 不要

**レスポンス `200 OK`:**
```json
[
  {
    "id": 10,
    "userId": 2,
    "username": "alice",
    "avatarUrl": "https://...",
    "content": "素敵な投稿ですね！",
    "createdAt": "2026-07-11T09:35:00",
    "replies": [
      {
        "id": 11,
        "userId": 3,
        "username": "jane",
        "avatarUrl": "https://...",
        "content": "ありがとう！",
        "createdAt": "2026-07-11T09:40:00",
        "replies": []
      }
    ]
  }
]
```

---

### POST `/api/posts/{id}/comments` — コメント追加

**認証:** 必要

**リクエスト:**
```json
{ "content": "素敵な投稿ですね！" }
```

**レスポンス `200 OK`:** CommentResponse（上記形式の単一オブジェクト）

---

### POST `/api/comments/{id}/replies` — 返信追加

**認証:** 必要

**リクエスト:**
```json
{ "content": "ありがとう！" }
```

**レスポンス `200 OK`:** CommentResponse

---

### DELETE `/api/comments/{id}` — コメント削除

**認証:** 必要（自分のコメントのみ）

**レスポンス `204 No Content`**

---

## 6. ユーザー・プロフィール API

### GET `/api/users/{id}` — プロフィール取得

**認証:** 不要

**レスポンス `200 OK`:**
```json
{
  "id": 3,
  "username": "jane",
  "email": "jane@example.com",
  "avatarUrl": "https://...",
  "bio": "よろしくお願いします",
  "followingCount": 10,
  "followerCount": 25,
  "createdAt": "2026-07-01T00:00:00"
}
```

---

### PUT `/api/users/me` — プロフィール更新

**認証:** 必要
**Content-Type:** `multipart/form-data`

**リクエストフォーム:**
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| bio | string | — | 自己紹介文（最大160文字） |
| avatar | file | — | アバター画像 |

**レスポンス `200 OK`:** UserResponse

---

### GET `/api/users/{id}/posts` — ユーザーの投稿一覧

**認証:** 不要

**クエリパラメータ:** `page`, `size`（タイムラインと同じ）

**レスポンス `200 OK`:** Page<PostResponse>（タイムラインと同じ形式）

---

### GET `/api/users/search` — ユーザー検索

**認証:** 必要

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| q | string | ○ | 検索キーワード（ユーザー名部分一致） |

**レスポンス `200 OK`:** `UserResponse[]`

---

### GET `/api/users/suggestions` — 知り合いかも？

**認証:** 必要

**レスポンス `200 OK`:** `UserResponse[]`（最大10件）

**ロジック:**
1. 自分のフォロー中ユーザーが共通してフォローしている人（共通フォロー数順）
2. 候補なしの場合: フォロワー数上位ユーザー
3. 自分自身・既フォロー済みは除外

---

## 7. フォロー API

### POST `/api/users/{id}/follow` — フォロー

**認証:** 必要

**レスポンス `200 OK`**（すでにフォロー済みの場合も 200）

---

### DELETE `/api/users/{id}/follow` — アンフォロー

**認証:** 必要

**レスポンス `204 No Content`**

---

### GET `/api/users/{id}/following` — フォロー中一覧

**認証:** 不要

**レスポンス `200 OK`:** `UserResponse[]`

---

### GET `/api/users/{id}/followers` — フォロワー一覧

**認証:** 不要

**レスポンス `200 OK`:** `UserResponse[]`
