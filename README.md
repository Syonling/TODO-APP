# Todoアプリ

タスクを効率的に管理するためのWebアプリケーション

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue)
![Python](https://img.shields.io/badge/Python-3.11.0+-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 目次

- [概要](#概要)
- [環境構築](#環境構築)
- [使い方](#使い方)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [プロジェクト構成](#プロジェクト構成)
- [API仕様](#api仕様)
- [設計上の工夫](#設計上の工夫)

---

## 概要

このアプリケーションは、タスク管理（Todo）とユーザー管理機能を持つフルスタックWebアプリケーションです。

Docker環境で簡単にセットアップでき、タスクの追加・編集・削除、期日や優先度による管理が可能です。

---

## 環境構築

### 必要な環境

- **Docker Desktop**（推奨）または Docker Engine + Docker Compose
- **Git**

### セットアップ手順

#### 方法1: Dockerイメージを使用（推奨・最速）

```bash
# 1. リポジトリをクローン
git clone https://github.com/Syonling/TODO-APP.git
cd TODO-APP

# 2. Dockerコンテナを起動
docker compose up -d

# 3. 起動完了を待つ（約30秒）
# データベースの初期化とバックエンドの起動を待機

# 4. ブラウザでアクセス
open http://localhost:3001
```

#### 方法2: ローカルビルド環境

```bash
# 1. リポジトリをクローン
git clone https://github.com/Syonling/TODO-APP.git
cd TODO-APP

# 2. 開発用Dockerコンテナを起動
docker compose -f docker-compose.local.yml up -d

# 3. 起動完了を待つ（初回は数分かかる場合があります）

# 4. ブラウザでアクセス
open http://localhost:3001
```

### 起動確認

```bash
# コンテナの状態を確認
docker compose ps

# 正常に起動していれば以下のような出力:
NAME                  IMAGE                              STATUS
todo-app-backend-1    ghcr.io/syonling/...backend:latest  Up
todo-app-db-1         postgres:15-alpine                  Up (healthy)
todo-app-frontend-1   ghcr.io/syonling/...frontend:latest Up
```

### ログの確認

```bash
# 全コンテナのログを表示
docker compose logs -f

# 特定のコンテナのログを表示
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### 停止・削除

```bash
# コンテナを停止
docker compose down

# データベースを含むすべてのデータを削除
docker compose down -v
```

### 動作確認済み環境

以下の環境でDockerコンテナの起動と動作を確認済みです：
- **macOS 14.5**
- **Windows 11**

---

## 使い方

### 1. ユーザー登録

1. ブラウザで `http://localhost:3001` にアクセス
2. トップ画面で「**新規登録**」ボタンをクリック
3. ユーザー名とパスワードを入力
   - **パスワード要件**: 8文字以上、英字と数字を含む（バックエンドで検証）
4. 「**登録**」ボタンをクリック
5. 登録成功後、自動的にログイン画面に遷移

### 2. ログイン

1. ログイン画面でユーザー名とパスワードを入力
2. 「**ログイン**」ボタンをクリック
3. 認証成功後、Todo一覧画面に遷移

### 3. Todoの管理

#### Todoの追加
1. Todo一覧画面上部の「**新しいタスクを追加**」フォームに入力
   - **タイトル**: Todoのタイトル
   - **期日**: 期日（日付選択）
   - **優先度**: 低・中・高から選択
2. 「**追加**」ボタンをクリック

#### Todoの編集
1. 各Todoの右側にある「**✎**」（編集）ボタンをクリック
2. タイトル、期日、優先度を編集
3. 「**✓ 保存**」ボタンで保存、または「**✕ キャンセル**」でキャンセル

#### Todoの完了・未完了
- チェックボックスをクリックして切り替え
- 完了したタスクはグレーアウト表示され、リスト下部に移動

#### Todoの削除
1. 各Todoの「**🗑**」（削除）ボタンをクリック
2. 確認ダイアログで「**OK**」を選択

#### 並び替え
画面上部の「**並び替え**」ドロップダウンから選択
- **デフォルト**: 作成日時順
- **期日順**: 期日順（昇順、同じ期日の場合は優先度降順）
- **優先度順（降順）**: 優先度順（降順、同じ優先度の場合は期日順）

### 4. タスク統計

画面上部に以下の統計情報が表示されます:
- **未完了 N 件**: 未完了タスク数
- **完了 N 件**: 完了タスク数

### 5. ユーザー情報の編集

1. Todo一覧画面右上の「**👤**」ドロップダウンをクリック
2. 「**情報編集**」を選択
3. 新しいユーザー名または新しいパスワードを入力
   - 変更しない項目は空欄のまま
4. 「**更新**」ボタンをクリック

### 6. ログアウト

1. Todo一覧画面右上の「**👤**」ドロップダウンをクリック
2. 「**ログアウト**」を選択
3. 確認ダイアログで「**確認**」をクリック
4. トップ画面に戻る
---

## 主な機能

### 📝 Todoリスト管理

#### 1. Todo追加機能
- Todo名、期日、優先度（低・中・高）を登録可能
- 入力検証：タイトルと期日は必須項目

#### 2. Todo一覧機能
- 登録したTodoを一覧で確認可能
- 完了・未完了の状態を視覚的に表示
- 完了したタスクはグレーアウト表示され、リスト下部に移動

#### 3. Todo編集機能
- Todo名、期日、優先度を編集可能
- インライン編集による直感的な操作

#### 4. Todo削除機能
- 確認ダイアログ付きの安全な削除機能

#### 5. 完了・未完了チェック
- チェックボックスでワンクリック切り替え
- 完了タスクは自動的にリスト下部へ移動

#### 6. 並び替え機能
- **期日順**: 期日の近いものから表示（同じ期日の場合は優先度降順）
- **優先度順**: 優先度の高いものから表示（同じ優先度の場合は期日順）

#### 7. タスク統計表示
- 完了タスク数
- 未完了タスク数

### 👤 ユーザー管理機能

#### 1. ユーザー登録
- ユーザー名（一意）とパスワードで登録
- **パスワード要件**:
  - 8文字以上
  - 英字と数字を両方含む
  - Argon2で暗号化して保存
  - ※ パスワード規則はバックエンドで検証されます

#### 2. ログイン機能
- JWTトークンによる認証（有効期限24時間）
- 失敗時は適切なエラーメッセージを表示

#### 3. ユーザー情報編集
- ユーザー名・パスワードの変更が可能
- 変更しない項目は空欄のまま送信

#### 4. ログアウト機能
- 確認ダイアログ付きの安全なログアウト
- トップ画面に戻る

### 🔒 セキュリティ

- パスワードはArgon2で暗号化
- JWTトークンによる認証
- ユーザーごとにTodoデータを分離管理
- CORS設定による安全なAPI通信

---
## 技術スタック

### フロントエンド
- **React** 18.2.0
- **JavaScript** (ES6+)
- **Axios** - HTTP通信ライブラリ

### バックエンド
- **Python** 3.11
- **FastAPI** 0.104.1 - 高速なWebフレームワーク
- **SQLAlchemy** 2.0 - ORM
- **Pydantic** 2.5 - データバリデーション
- **Passlib + Argon2** - パスワード暗号化
- **Python-JOSE** - JWT認証

### データベース
- **PostgreSQL** 15

### インフラ
- **Docker** & **Docker Compose**
- **Nginx** - フロントエンド配信

---
## プロジェクト構成

```
TODO-APP/
├── docker-compose.yml              # Docker構成ファイル（本番用）
├── docker-compose.local.yml        # Docker構成ファイル（開発用）
├── README.md                       # このファイル
│
├── backend/                        # バックエンド
│   ├── Dockerfile
│   ├── requirements.txt            # Python依存関係
│   └── app/
│       ├── main.py                 # FastAPIアプリケーション
│       ├── database.py             # データベース接続
│       ├── models.py               # SQLAlchemyモデル
│       ├── schemas.py              # Pydanticスキーマ
│       ├── core/
│       │   ├── config.py           # 設定管理
│       │   └── security.py         # 認証・暗号化
│       └── api/
│           ├── users.py            # ユーザー関連API
│           └── todos.py            # Todo関連API
│
└── frontend/                       # フロントエンド
    ├── Dockerfile
    ├── nginx.conf                  # Nginx設定
    ├── package.json                # Node.js依存関係
    └── src/
        ├── App.js                  # ルーティング管理
        ├── index.js                # エントリーポイント
        ├── services/
        │   └── api.js              # API通信
        ├── styles/
        │   └── design-config.js    # デザイン設定
        └── pages/
            ├── TopPage.jsx         # トップ画面
            ├── LoginPage.jsx       # ログイン画面
            ├── RegisterPage.jsx    # 登録画面
            ├── TodoPage.jsx        # Todo一覧画面
            └── UserPage.jsx        # ユーザー情報画面
```

---

## API仕様

### ユーザー管理

| メソッド | エンドポイント | 説明 | 認証 |
|---------|--------------|------|-----|
| POST | `/api/users/register` | ユーザー登録 | 不要 |
| POST | `/api/users/login` | ログイン（JWTトークン取得） | 不要 |
| GET | `/api/users/me` | 現在のユーザー情報取得 | 必要 |
| PUT | `/api/users/me` | ユーザー情報更新 | 必要 |

### Todo管理

| メソッド | エンドポイント | 説明 | 認証 |
|---------|--------------|------|-----|
| GET | `/api/todos?sort={sort}&order={order}` | Todo一覧取得 | 必要 |
| POST | `/api/todos` | Todo作成 | 必要 |
| PUT | `/api/todos/{todo_id}` | Todo更新 | 必要 |
| PATCH | `/api/todos/{todo_id}/toggle` | 完了状態切り替え | 必要 |
| DELETE | `/api/todos/{todo_id}` | Todo削除 | 必要 |

---

## 設計上の工夫

### フロントエンド

- **統一されたデザインシステム**: `design-config.js`で全スタイルを一元管理
- **ユーザー体験の向上**: 
  - 確認ダイアログによる誤操作防止
  - ドロップダウンメニューによる直感的な操作
  - タスク統計のリアルタイム表示

### バックエンド

- **RESTful API設計**: 標準的なHTTPメソッドとステータスコードを使用
- **セキュリティ**: 
  - パスワードのArgon2暗号化
  - JWTトークンによる認証
  - ユーザーごとのデータ分離
- **エラーハンドリング**: 適切なエラーメッセージとステータスコード

### データベース

- **正規化**: ユーザーとTodoの適切な分離
- **インデックス**: user_idに対するインデックスでクエリ性能向上
- **制約**: NOT NULL, UNIQUE, FOREIGN KEYによるデータ整合性確保

---

## ライセンス

このプロジェクトは課題練習目的で作成されたものです。

---

## お問い合わせ

質問や問題がある場合は、GitHubのIssuesでお知らせください。

**GitHub**: https://github.com/Syonling/TODO-APP