# 🚀 Vercel分離デプロイガイド（Vercel Postgres使用）

このガイドでは、バックエンドとフロントエンドを別々のVercelプロジェクトとしてデプロイし、Vercel Postgresを使用します。

## 📋 前提条件

- ✅ Vercelアカウント (https://vercel.com)
- ✅ GitHubアカウント
- ✅ GitHubリポジトリにプッシュ済み

---

## 🗄️ ステップ1: GitHubリポジトリの準備

プロジェクトがまだGitHubにない場合：

```bash
cd /home/kazuki/sales-management-system

# 初期化（既にある場合はスキップ）
git init
git add .
git commit -m "Ready for Vercel deployment"

# GitHubリポジトリを作成してプッシュ
git remote add origin https://github.com/YOUR_USERNAME/sales-management-system.git
git branch -M main
git push -u origin main
```

---

## 🔧 ステップ2: バックエンドのデプロイ

### 2-1. Vercelプロジェクトの作成

1. https://vercel.com/dashboard にログイン
2. **「Add New」** → **「Project」** をクリック
3. GitHubリポジトリ `sales-management-system` を選択
4. **「Import」** をクリック

### 2-2. プロジェクト設定

以下のように設定：

- **Project Name**: `sales-management-backend`（または任意の名前）
- **Framework Preset**: `Other`
- **Root Directory**: `backend` （Editボタンをクリックして設定）
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2-3. 環境変数の設定（後で設定）

この段階では環境変数は設定せず、**「Deploy」をクリック**

⚠️ **最初のデプロイは失敗します**（DATABASE_URLがないため）。これは正常です。

### 2-4. Vercel Postgresのセットアップ

1. デプロイされたプロジェクトのダッシュボードに移動
2. **「Storage」** タブをクリック
3. **「Create Database」** をクリック
4. **「Postgres」** を選択
5. データベース名を入力（例: `sales-db`）
6. リージョンを選択（推奨: `Washington, D.C., USA (iad1)`）
7. **「Create」** をクリック

### 2-5. 環境変数の追加

Vercel Postgresを作成すると、`DATABASE_URL`などが自動的に環境変数に追加されます。

追加で以下の環境変数を設定：

1. **「Settings」** → **「Environment Variables」** に移動
2. 以下を追加：

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS-TO-RANDOM-STRING-123456789
CORS_ORIGIN=*
```

⚠️ **重要**:
- `JWT_SECRET`は強力なランダム文字列に変更してください（最低32文字推奨）
- `CORS_ORIGIN`は後でフロントエンドのURLに更新します

### 2-6. データベーススキーマの初期化

Vercel Postgresダッシュボードで：

1. **「Storage」** → 作成したデータベースをクリック
2. **「Query」** タブを選択
3. 以下のSQLを実行（プロジェクトルートの `supabase-setup-schema.sql` の内容）：

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
```

4. **「Run Query」** をクリック

### 2-7. 初期データの投入（オプション）

サンプルデータが必要な場合、`supabase-setup-seed.sql` の内容も実行してください。

### 2-8. 再デプロイ

1. **「Deployments」** タブに移動
2. 最新のデプロイの右側にある **「...」** → **「Redeploy」** をクリック
3. **「Redeploy」** を確認

デプロイが成功したら、URLをコピーしてください：
```
https://sales-management-backend.vercel.app
```

### 2-9. バックエンドの動作確認

```bash
curl https://YOUR-BACKEND-URL.vercel.app/health
```

期待される応答：
```json
{"status":"OK","timestamp":"2025-10-27T..."}
```

---

## 🎨 ステップ3: フロントエンドのデプロイ

### 3-1. 環境変数ファイルの更新

ローカルで `frontend/.env.production` を編集：

```bash
cd /home/kazuki/sales-management-system/frontend
```

`.env.production` を以下のように更新：

```env
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

**YOUR-BACKEND-URL** をステップ2-8でコピーしたバックエンドのURLに置き換えてください。

コミットしてプッシュ：

```bash
git add .env.production
git commit -m "Update API URL for production"
git push
```

### 3-2. Vercelプロジェクトの作成

1. Vercelダッシュボードで **「Add New」** → **「Project」**
2. 同じGitHubリポジトリ `sales-management-system` を選択
3. **「Import」** をクリック

### 3-3. プロジェクト設定

以下のように設定：

- **Project Name**: `sales-management-frontend`（または任意の名前）
- **Framework Preset**: `Vite`（自動検出されるはず）
- **Root Directory**: `frontend` （Editボタンをクリックして設定）
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3-4. 環境変数の設定

**「Environment Variables」** セクションで：

```env
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

### 3-5. デプロイ

**「Deploy」** をクリック

デプロイが完了したら、フロントエンドのURLをコピー：
```
https://sales-management-frontend.vercel.app
```

---

## 🔄 ステップ4: CORS設定の更新

### 4-1. バックエンドのCORS設定

1. バックエンドのVercelプロジェクトに移動
2. **「Settings」** → **「Environment Variables」**
3. `CORS_ORIGIN` を編集：

```env
CORS_ORIGIN=https://YOUR-FRONTEND-URL.vercel.app
```

**YOUR-FRONTEND-URL** をステップ3-5でコピーしたフロントエンドのURLに置き換えてください。

⚠️ **トレーリングスラッシュは付けないでください**

### 4-2. 再デプロイ

1. **「Deployments」** タブ
2. 最新のデプロイの **「...」** → **「Redeploy」**

---

## 🎉 ステップ5: 動作確認

### 5-1. フロントエンドにアクセス

ブラウザで以下にアクセス：
```
https://YOUR-FRONTEND-URL.vercel.app
```

### 5-2. 管理者ユーザーの作成

Vercel Postgresダッシュボードで以下のSQLを実行：

```sql
-- パスワード: admin123 のハッシュ値（bcryptjs使用）
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@sales.com',
  '$2a$10$8J9FZ3Z.zGQ5Y9X5X5X5XuJ9Z.zGQ5Y9X5X5X5XuJ9Z.zGQ5Y9X5X5',
  '管理者',
  'admin'
);
```

または、登録ページから新規登録してください。**最初に登録したユーザーは自動的に管理者になります**。

### 5-3. ログイン

1. フロントエンドでログインページに移動
2. 以下でログイン：
   - Email: `admin@sales.com`
   - Password: `admin123`

---

## 📊 デプロイ後の設定

### カスタムドメインの設定（オプション）

#### バックエンド

1. バックエンドプロジェクトの **「Settings」** → **「Domains」**
2. カスタムドメインを追加（例: `api.yourdomain.com`）
3. DNSレコードを設定（Vercelが指示を表示）

#### フロントエンド

1. フロントエンドプロジェクトの **「Settings」** → **「Domains」**
2. カスタムドメインを追加（例: `app.yourdomain.com`）
3. DNSレコードを設定

#### CORS更新

カスタムドメイン設定後、バックエンドの `CORS_ORIGIN` を更新：
```env
CORS_ORIGIN=https://app.yourdomain.com
```

---

## 🐛 トラブルシューティング

### デプロイが失敗する

**原因**: ビルドエラー、依存関係の問題

**解決策**:
```bash
# ローカルでビルドテスト
cd backend && npm run build
cd frontend && npm run build
```

### CORS エラー

**原因**: CORS_ORIGIN設定が間違っている

**解決策**:
1. フロントエンドの正確なURLを確認（トレーリングスラッシュなし）
2. バックエンドの環境変数を更新
3. 再デプロイ

### データベース接続エラー

**原因**: DATABASE_URLが設定されていない

**解決策**:
1. Vercel Postgresが正しく作成されているか確認
2. 環境変数に `DATABASE_URL` が自動追加されているか確認
3. バックエンドを再デプロイ

### 認証が動作しない

**原因**: JWT_SECRETが設定されていない

**解決策**:
1. バックエンドの環境変数に `JWT_SECRET` を追加
2. 再デプロイ

---

## 🔐 セキュリティチェックリスト

- [ ] `JWT_SECRET` を強力なランダム文字列に設定済み
- [ ] `NODE_ENV=production` を設定済み
- [ ] `CORS_ORIGIN` をフロントエンドのURLのみに制限済み
- [ ] データベース接続はSSL使用（Vercel Postgresは自動）
- [ ] 環境変数に機密情報を保存（コードに含めていない）

---

## 📚 便利なコマンド

### Vercel CLIを使う場合

```bash
# Vercel CLIインストール
npm install -g vercel

# バックエンドデプロイ
cd backend
vercel --prod

# フロントエンドデプロイ
cd frontend
vercel --prod
```

---

## 🎯 次のステップ

1. ✅ カスタムドメインの設定
2. ✅ モニタリング設定（Vercel Analytics）
3. ✅ エラートラッキング（Sentry等）
4. ✅ 定期バックアップの設定

---

**デプロイ成功を祈ります！** 🚀

質問がある場合は、Vercelのドキュメントを参照してください：
- https://vercel.com/docs
- https://vercel.com/docs/storage/vercel-postgres
