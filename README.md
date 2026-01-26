# Todoアプリ

タスクを効率的に管理するためのWebアプリケーション

## 目次

- [概要](#概要)
- [機能](#機能)
- [技術スタック](#技術スタック)
- [環境構築](#環境構築)
- [使い方](#使い方)
- [プロジェクト構成](#プロジェクト構成)
- [開発者向け情報](#開発者向け情報)

---

## 概要

このアプリケーションは、タスク管理（Todo）とユーザー管理機能を持つフルスタックWebアプリケーションです。Docker環境で簡単にセットアップでき、タスクの追加・編集・削除、期日や優先度による管理が可能です。

---

## 機能

### Todoリスト管理
- ✅ **Todo追加機能**: Todo名、期日、優先度（1-5）を登録可能
- ✅ **Todo一覧機能**: 登録したTodoを一覧表示
- ✅ **Todo編集機能**: Todo名、期日、優先度を編集可能
- ✅ **Todo削除機能**: Todoを削除可能
- ✅ **完了・未完了チェック**: チェックボックスでタスクの完了状態を管理（完了タスクはグレーアウト）
- ✅ **並び替え機能**: 期日順・優先度順（高→低）でソート可能

### ユーザー管理機能
- ✅ **ユーザー登録**: ユーザー名（一意）とパスワード（8文字以上、英数字含む）で登録
- ✅ **ログイン機能**: 登録したアカウントでログイン（失敗時はエラーメッセージ表示）
- ✅ **ユーザー情報編集**: ユーザー名・パスワードの変更が可能
- ✅ **ログアウト機能**: ログアウトしてトップ画面に戻る

### セキュリティ
- パスワードはArgon2で暗号化して保存
- JWTトークンによる認証（有効期限24時間）
- ユーザーごとにTodoデータを分離管理

---

## 技術スタック

### フロントエンド
- React 18
- JavaScript (ES6+)
- Axios（HTTP通信）

### バックエンド
- Python 3.11
- FastAPI（Webフレームワーク）
- SQLAlchemy（ORM）
- Pydantic（データバリデーション）
- Passlib + Argon2（パスワード暗号化）
- Python-JOSE（JWT認証）

### データベース
- PostgreSQL 15

### インフラ
- Docker & Docker Compose
- Nginx（フロントエンド配信）

---

## 環境構築

### 必要な環境

- Docker Desktop（推奨）または Docker Engine + Docker Compose
- Git

### セットアップ手順

#### 方法1: Dockerイメージを使用（推奨）

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd todo-app

# 2. Dockerコンテナを起動
docker-compose up -d

# 3. 起動完了を待つ（約30秒）
# バックエンドが正常に起動するまで待機

# 4. ブラウザでアクセス
open http://localhost:3000
```

#### 方法2: ローカルビルド環境

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd todo-app

# 2. 開発用Dockerコンテナを起動
docker compose -f docker-compose.dev.yml up -d

# 3. 起動完了を待つ（初回は数分かかる場合があります）

# 4. ブラウザでアクセス
open http://localhost:3000
```

### 起動確認

```bash
# コンテナの状態を確認
docker-compose ps

# 正常に起動していれば以下のような出力:
# NAME                IMAGE               STATUS
# todo-app-backend-1  todo-app-backend    Up
# todo-app-db-1       postgres:15-alpine  Up (healthy)
# todo-app-frontend-1 todo-app-frontend   Up
```

### ログの確認

```bash
# 全コンテナのログを表示
docker-compose logs -f

# 特定のコンテナのログを表示
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 使い方

### 1. ユーザー登録

1. ブラウザで `http://localhost:3000` にアクセス
2. トップ画面で「新規登録」ボタンをクリック
3. ユーザー名とパスワードを入力
   - **パスワード要件**: 8文字以上、英字と数字を含む
4. 「登録」ボタンをクリック
5. 登録成功後、自動的にログイン画面に遷移

### 2. ログイン

1. ログイン画面でユーザー名とパスワードを入力
2. 「ログイン」ボタンをクリック
3. 認証成功後、Todo一覧画面に遷移

### 3. Todoの管理

#### Todoの追加
1. Todo一覧画面上部の「添加新任务」フォームに入力
   - **タスク標題**: Todoの名前
   - **期限**: 期日（日付選択）
   - **優先度**: 1（最低）〜 5（最高）
2. 「添加任务」ボタンをクリック

#### Todoの編集
1. 各Todoの右側にある「編集」ボタンをクリック
2. タイトル、期日、優先度を編集
3. 「保存」ボタンで保存、または「取消」でキャンセル

#### Todoの完了・未完了
- チェックボックスをクリックして切り替え
- 完了したタスクはグレーアウトして表示され、リスト下部に移動

#### Todoの削除
1. 各Todoの「删除」ボタンをクリック
2. 確認ダイアログで「OK」を選択

#### 並び替え
- 画面上部の「排序方式」ドロップダウンから選択
  - **默认**: 作成日時順
  - **按期限**: 期日順（昇順）
  - **按优先度（高到低）**: 優先度順（降順）

### 4. ユーザー情報の編集

1. Todo一覧画面の「用户信息」ボタンをクリック
2. 新しいユーザー名または新しいパスワードを入力
   - パスワードを変更しない場合は空欄のまま
3. 「更新信息」ボタンをクリック

### 5. ログアウト

- Todo一覧画面の「登出」ボタンをクリック
- トップ画面に戻る

---

## プロジェクト構成

```
todo-app/
├── docker-compose.yml          # Docker構成ファイル
├── backend/                    # バックエンド
│   ├── Dockerfile
│   ├── requirements.txt        # Python依存関係
│   └── app/
│       ├── main.py            # FastAPIアプリケーション
│       ├── database.py        # データベース接続
│       ├── models.py          # SQLAlchemyモデル
│       ├── schemas.py         # Pydanticスキーマ
│       ├── core/
│       │   ├── config.py      # 設定管理
│       │   └── security.py    # 認証・暗号化
│       └── api/
│           ├── users.py       # ユーザー関連API
│           └── todos.py       # Todo関連API
└── frontend/                   # フロントエンド
    ├── Dockerfile
    ├── nginx.conf             # Nginx設定
    ├── package.json           # Node.js依存関係
    └── src/
        ├── App.js            # ルーティング管理
        ├── index.js          # エントリーポイント
        ├── ErrorBoundary.js  # エラー処理
        ├── services/
        │   └── api.js        # API通信
        └── pages/
            ├── TopPage.jsx       # トップ画面
            ├── LoginPage.jsx     # ログイン画面
            ├── RegisterPage.jsx  # 登録画面
            ├── TodoPage.jsx      # Todo一覧画面
            └── UserPage.jsx      # ユーザー情報画面
```

---

## 開発者向け情報

### API エンドポイント

#### ユーザー管理
- `POST /api/users/register` - ユーザー登録
- `POST /api/users/login` - ログイン（JWTトークン取得）
- `GET /api/users/me` - 現在のユーザー情報取得
- `PUT /api/users/me` - ユーザー情報更新

#### Todo管理
- `GET /api/todos?sort={sort}&order={order}` - Todo一覧取得
- `POST /api/todos` - Todo作成
- `PUT /api/todos/{id}` - Todo更新
- `PATCH /api/todos/{id}/toggle` - 完了状態切り替え
- `DELETE /api/todos/{id}` - Todo削除

### データベーススキーマ

#### usersテーブル
| カラム名        | 型       | 説明                    |
|---------------|----------|------------------------|
| id            | Integer  | プライマリキー            |
| username      | String   | ユーザー名（一意）         |
| password_hash | String   | パスワード（Argon2暗号化） |
| created_at    | DateTime | 作成日時                |
| updated_at    | DateTime | 更新日時                |

#### todosテーブル
| カラム名    | 型       | 説明                          |
|-----------|----------|------------------------------|
| id        | Integer  | プライマリキー                  |
| user_id   | Integer  | 外部キー（users.id）           |
| title     | String   | Todoタイトル                  |
| due_date  | Date     | 期日                         |
| priority  | Integer  | 優先度（1-5）                 |
| completed | Boolean  | 完了フラグ（デフォルト: False） |
| created_at| DateTime | 作成日時                      |
| updated_at| DateTime | 更新日時                      |

### 開発モード

```bash
# データベースのみDockerで起動し、バックエンド・フロントエンドをローカルで実行

# 1. データベースのみ起動
docker-compose up db -d

# 2. バックエンドをローカル実行（別ターミナル）
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. フロントエンドをローカル実行（別ターミナル）
cd frontend
npm install
npm start
```

### データのリセット

```bash
# データベースを含む全データを削除して再起動
docker-compose down -v
docker-compose up -d
```

### トラブルシューティング

#### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :3000  # フロントエンド
lsof -i :8000  # バックエンド
lsof -i :5432  # データベース

# docker-compose.ymlのportsセクションを変更
```

#### コンテナが起動しない
```bash
# ログを確認
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# 完全にクリーンアップして再起動
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

#### ログイン後に白い画面が表示される
```bash
# ブラウザのキャッシュとlocalStorageをクリア
# または、シークレットモードで開く

# フロントエンドを再ビルド
docker-compose up -d --build frontend
```

---

## ライセンス

このプロジェクトは教育目的で作成されたものです。

---

## お問い合わせ

質問や問題がある場合は、GitHubのIssuesでお知らせください。
