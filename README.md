# TextSNS

テキスト・画像を投稿し、ユーザー同士がつながれる SNS サービスです。

---

## 機能一覧

- ユーザー登録 / ログイン / ログアウト（JWT 認証）
- プロフィール編集（アバター画像・自己紹介）
- ユーザー検索（ユーザー名部分一致）・「知り合いかも？」提案（ワンクリックフォロー）
- タイムライン（フォロー中ユーザーの投稿を新着順表示）
- 投稿作成（テキスト最大280文字 + 画像1枚）/ 削除
- いいね！（トグル）・いいね件数表示
- コメント・返信（1階層）・コメント件数表示
- フォロー / アンフォロー・フォロー一覧・フォロワー一覧

---

## ユースケース

### UC-1: 新規ユーザー登録・ログイン

```
アクター: 未登録ユーザー

1. /register にアクセスし、ユーザー名・メール・パスワードを入力して登録
2. 登録完了後、JWT トークンを取得してタイムラインへ遷移
3. 次回以降は /login でメール・パスワードを入力してログイン
```

### UC-2: 投稿する

```
アクター: ログイン済みユーザー

1. ナビゲーションバーの「投稿」ボタンから /posts/new へ遷移
2. テキスト（最大280文字）を入力し、任意で画像を添付
3. 「投稿する」ボタンを押すと投稿が作成され、タイムラインへ戻る
4. 自分の投稿にはタイムライン上に削除ボタンが表示される
```

### UC-3: タイムラインを見る・リアクションする

```
アクター: ログイン済みユーザー

1. / にアクセスするとフォロー中ユーザー＋自分の投稿が新着順に表示される
2. 投稿カードに表示された ♥ ボタンを押していいね！する（再度押すと取り消し）
3. 💬 ボタンを押してコメントモーダルを開き、コメントを送信する
4. コメントに対して返信ボタンを押し、返信を送信する
5. 投稿カードにいいね件数・コメント件数がリアルタイムで反映される
```

### UC-4: 他のユーザーを探してフォローする

```
アクター: ログイン済みユーザー

1. 検索画面 /search に遷移する
2-a. 検索ボックスにユーザー名を入力し、部分一致で検索する
2-b. 画面下部の「知り合いかも？」セクションに提案ユーザーが最大10件表示される
     ・自分がフォローしている人が共通してフォローしているユーザーを優先表示
     ・フォロー0人の場合はフォロワー数上位ユーザーを表示
3. ユーザーカードの「フォローする」ボタンをクリックしてフォロー
4. フォロー後はボタンが「フォロー中」に変わり、タイムラインにその人の投稿が流れ始める
```

### UC-5: プロフィールを確認・編集する

```
アクター: ログイン済みユーザー

1. ナビゲーションバーのアイコンから自分のプロフィールページ /users/:id へ遷移
2. アバター画像・ユーザー名・自己紹介・投稿一覧・フォロー数/フォロワー数が表示される
3. 「プロフィール編集」ボタンから自己紹介文とアバター画像を更新できる
4. 他ユーザーのプロフィールページでは「フォローする / フォロー中」ボタンが表示される
```

### UC-6: フォロー関係を確認する

```
アクター: ログイン済みユーザー

1. プロフィールページのフォロー数をクリックすると /users/:id/following へ遷移
2. フォロー中のユーザーカード一覧が表示される（各カードにフォロー/アンフォローボタン）
3. フォロワー数をクリックすると /users/:id/followers へ遷移
4. フォロワーのユーザーカード一覧が表示される
```

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 14.x (App Router) | フロントエンドフレームワーク |
| React | 18.x | UI ライブラリ |
| TypeScript | ^5 | 型安全な開発。API レスポンス型定義で整合性を保つ |
| Tailwind CSS | ^3 | ユーティリティクラスによるスタイリング |

### バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Spring Boot | 3.2.x | REST API サーバー |
| Java | 17 | バックエンド言語 |
| Spring Security + JWT | jjwt 0.12 | 認証・認可 |
| Spring Data JPA | — | ORM / データアクセス層 |

### データストア・ストレージ

| 技術 | 用途 |
|------|------|
| MySQL 8.0 | リレーショナルDB（ユーザー・投稿・フォロー等） |
| Amazon S3 | 投稿画像・アバター画像の永続化 |
| AWS SDK for Java 2.x | Spring Boot から S3 へアップロード |

### インフラ

| 技術 | 用途 |
|------|------|
| Amazon EC2 (t3.small) | アプリサーバー（Spring Boot + Nginx） |
| Amazon RDS MySQL 8.0 | マネージド DB（Multi-AZ） |
| Amazon ALB | HTTPS 終端・ロードバランサー |
| Amazon Route 53 | DNS |
| Amazon S3 | 画像ストレージ |
| IAM Role | EC2 → S3 アクセス権限 |
| Maven 3 | バックエンドビルドツール |

---

## プロジェクト構成

```
sns-app/
├── docs/
│   ├── requirements.md       # 要件定義・設計書
│   └── infrastructure.drawio # AWS インフラ構成図（draw.io）
├── backend/                  # Spring Boot アプリケーション
│   ├── src/
│   └── pom.xml
└── frontend/                 # React アプリケーション
    ├── src/
    └── package.json
```

---

## インフラ構成（AWS）

```
インターネット → Route 53 → ALB
                              │
                    ┌─────────┴──────────┐
                    │ VPC                 │
                    │ ┌────────────────┐  │
                    │ │ EC2 (Public)   │  │
                    │ │ Spring Boot    │  │
                    │ │ + Nginx        │  │
                    │ └───────┬────────┘  │
                    │         │           │
                    │ ┌───────▼────────┐  │
                    │ │ RDS MySQL 8    │  │
                    │ │ (Private)      │  │
                    │ │ Multi-AZ       │  │
                    │ └────────────────┘  │
                    └────────────────────┘
                              │
                         ┌────▼────┐
                         │   S3    │
                         │ (画像)   │
                         └─────────┘
```

詳細は [docs/infrastructure.drawio](docs/infrastructure.drawio) を draw.io / diagrams.net で開いてください。

---

## ローカル開発手順

### 前提条件

- Java 17+
- Maven 3.x
- Node.js 18+
- MySQL 8.0（ローカルまたは Docker）
- AWS 認証情報（`~/.aws/credentials` または 環境変数）

### 1. データベース作成

```sql
CREATE DATABASE sns_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. バックエンド起動

```bash
cd backend

# 環境変数を設定（または application.yml を直接編集）
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key-here-make-it-long-enough
export S3_BUCKET_NAME=your-s3-bucket-name
export AWS_REGION=ap-northeast-1

mvn spring-boot:run
```

バックエンドは `http://localhost:8080` で起動します。

### 3. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

---

## 環境変数一覧

### バックエンド（`application.yml` または 環境変数）

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `DB_USERNAME` | MySQL ユーザー名 | `root` |
| `DB_PASSWORD` | MySQL パスワード | `password` |
| `JWT_SECRET` | JWT 署名秘密鍵（256bit以上） | — |
| `S3_BUCKET_NAME` | S3 バケット名 | `sns-app-images` |
| `AWS_REGION` | AWS リージョン | `ap-northeast-1` |

---

## API 概要

| カテゴリ | Method | Path | 認証 |
|---------|--------|------|------|
| 認証 | POST | /api/auth/register | 不要 |
| 認証 | POST | /api/auth/login | 不要 |
| タイムライン | GET | /api/posts | 必要 |
| 投稿作成 | POST | /api/posts | 必要 |
| 投稿削除 | DELETE | /api/posts/{id} | 必要 |
| いいね | POST/DELETE | /api/posts/{id}/likes | 必要 |
| コメント | GET/POST | /api/posts/{id}/comments | GET:不要 |
| 返信 | POST | /api/comments/{id}/replies | 必要 |
| プロフィール | GET | /api/users/{id} | 不要 |
| プロフィール更新 | PUT | /api/users/me | 必要 |
| ユーザー検索 | GET | /api/users/search?q={keyword} | 必要 |
| 知り合いかも？ | GET | /api/users/suggestions | 必要 |
| フォロー | POST/DELETE | /api/users/{id}/follow | 必要 |
| フォロー一覧 | GET | /api/users/{id}/following | 不要 |
| フォロワー一覧 | GET | /api/users/{id}/followers | 不要 |

詳細は [docs/requirements.md](docs/requirements.md) を参照してください。

---

## 画面一覧

| 画面 | URL |
|------|-----|
| ユーザー登録 | /register |
| ログイン | /login |
| タイムライン | / |
| 投稿作成 | /posts/new |
| プロフィール | /users/:id |
| フォロー一覧 | /users/:id/following |
| フォロワー一覧 | /users/:id/followers |
| ユーザー検索 | /search |
