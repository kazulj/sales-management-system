# ⚡ Vercel クイックスタートガイド

最速でVercelにデプロイするための簡略版ガイドです。

## 🚀 3ステップデプロイ

### ステップ1: GitHubにプッシュ

```bash
cd /home/kazuki/sales-management-system

# まだの場合
git add .
git commit -m "Ready for deployment"
git push
```

### ステップ2: バックエンドをデプロイ

1. https://vercel.com/new にアクセス
2. リポジトリを選択
3. 設定：
   - **Root Directory**: `backend`
   - **Framework**: `Other`
4. **Deploy** をクリック（失敗してOK）
5. **Storage** → **Create Database** → **Postgres** を選択
6. **Settings** → **Environment Variables** で追加：
   ```
   NODE_ENV=production
   JWT_SECRET=ランダムな長い文字列（32文字以上）
   CORS_ORIGIN=*
   ```
7. **Storage** → データベース → **Query** タブでスキーマ実行：
   - `/home/kazuki/sales-management-system/supabase-setup-schema.sql` の内容をコピペして実行
8. **Deployments** → 最新のデプロイ → **Redeploy**
9. デプロイ成功後、URLをコピー（例: `https://xxx.vercel.app`）

### ステップ3: フロントエンドをデプロイ

1. ローカルで `.env.production` を更新：
   ```bash
   cd frontend
   echo "VITE_API_URL=https://バックエンドのURL" > .env.production
   git add .env.production
   git commit -m "Update production API URL"
   git push
   ```

2. https://vercel.com/new にアクセス
3. 同じリポジトリを選択
4. 設定：
   - **Root Directory**: `frontend`
   - **Framework**: `Vite`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://バックエンドのURL
   ```
6. **Deploy** をクリック
7. デプロイ成功後、フロントエンドURLをコピー

### ステップ4: CORS更新

1. バックエンドプロジェクトの **Settings** → **Environment Variables**
2. `CORS_ORIGIN` を更新：
   ```
   CORS_ORIGIN=https://フロントエンドのURL
   ```
3. **Redeploy**

## ✅ 完了！

フロントエンドURLにアクセスして、アプリを使い始められます！

---

## 🔧 Vercel CLIを使う場合

```bash
# Vercel CLIインストール
npm install -g vercel

# ログイン
vercel login

# バックエンドデプロイ
cd backend
vercel --prod

# フロントエンドデプロイ
cd frontend
vercel --prod
```

環境変数はVercelダッシュボードで設定してください。

---

詳細は `DEPLOY.md` を参照してください。
