# 🚀 Vercel デプロイガイド

Sales Management System を Vercel にデプロイする完全ガイド

## 📋 前提条件

- Vercel アカウント（https://vercel.com）
- GitHub アカウント
- Vercel CLI（オプション）

## 🎯 デプロイ戦略

このプロジェクトは2つの方法でVercelにデプロイできます：

### オプション1: 分離デプロイ（推奨）
フロントエンドとバックエンドを別々のVercelプロジェクトとしてデプロイ

### オプション2: モノリスデプロイ
単一のVercelプロジェクトとしてデプロイ（制限あり）

---

## 🔧 オプション1: 分離デプロイ（推奨）

### ステップ1: バックエンドのデプロイ

#### 1-1. GitHubリポジトリの作成

```bash
# プロジェクトルートで
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/sales-backend.git
git push -u origin main
```

#### 1-2. Vercelプロジェクトの作成

1. https://vercel.com にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. **Root Directory** を `backend` に設定
5. **Framework Preset** を「Other」に設定

#### 1-3. 環境変数の設定

Vercel ダッシュボードの「Settings」→「Environment Variables」で以下を設定：

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS-TO-RANDOM-STRING
JWT_EXPIRES_IN=7d
DATABASE_PATH=/tmp/sales.db
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

⚠️ **重要**:
- `JWT_SECRET` は強力なランダム文字列に変更してください
- `CORS_ORIGIN` はフロントエンドのURLに変更してください（後で更新）
- SQLiteは`/tmp`ディレクトリを使用（Vercelの制限により永続化されません）

#### 1-4. デプロイ

「Deploy」ボタンをクリックしてデプロイを開始

デプロイ完了後、バックエンドのURLをメモ：
```
https://your-backend-name.vercel.app
```

---

### ステップ2: フロントエンドのデプロイ

#### 2-1. 環境変数ファイルの更新

`frontend/.env.production`を編集：

```env
VITE_API_URL=https://your-backend-name.vercel.app
```

変更をコミット：
```bash
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

#### 2-2. Vercelプロジェクトの作成

1. Vercelダッシュボードで「New Project」
2. 同じGitHubリポジトリを選択
3. **Root Directory** を `frontend` に設定
4. **Framework Preset** を「Vite」に設定
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

#### 2-3. 環境変数の設定

```env
VITE_API_URL=https://your-backend-name.vercel.app
```

#### 2-4. デプロイ

「Deploy」ボタンをクリック

デプロイ完了後、フロントエンドのURLをメモ：
```
https://your-frontend-name.vercel.app
```

---

### ステップ3: CORS設定の更新

バックエンドのVercelプロジェクトに戻り、環境変数を更新：

```env
CORS_ORIGIN=https://your-frontend-name.vercel.app
```

「Redeploy」をクリックして再デプロイ

---

## 🎯 オプション2: Vercel CLIを使用したデプロイ

### インストール

```bash
npm install -g vercel
```

### バックエンドのデプロイ

```bash
cd backend
vercel

# プロンプトに従って設定
# Root directory: ./
# Build Command: npm run build
# Output Directory: dist
```

環境変数の設定：
```bash
vercel env add JWT_SECRET
vercel env add CORS_ORIGIN
vercel env add DATABASE_PATH
```

### フロントエンドのデプロイ

```bash
cd frontend
vercel

# プロンプトに従って設定
# Root directory: ./
# Build Command: npm run build
# Output Directory: dist
```

環境変数の設定：
```bash
vercel env add VITE_API_URL
```

---

## ⚠️ データベースに関する重要な注意事項

Vercelのサーバーレス環境では、SQLiteファイルは永続化されません。

### 本番環境の推奨

1. **Supabase**（PostgreSQL）
   - 無料プランあり
   - https://supabase.com

2. **PlanetScale**（MySQL）
   - 無料プランあり
   - https://planetscale.com

3. **Neon**（PostgreSQL）
   - 無料プランあり
   - https://neon.tech

### データベース移行の例（Supabase）

#### 1. Supabaseプロジェクトの作成

1. https://supabase.com でプロジェクト作成
2. Database URLをコピー

#### 2. バックエンドの更新

`backend/package.json`に追加：
```json
"dependencies": {
  "pg": "^8.11.3"
}
```

`backend/src/config/database.ts`を更新：
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
```

#### 3. Vercel環境変数に追加

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## 🔍 デプロイ後の確認

### バックエンドのヘルスチェック

```bash
curl https://your-backend-name.vercel.app/health
```

期待される応答：
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

### フロントエンドの確認

ブラウザで`https://your-frontend-name.vercel.app`にアクセス

### 初回ユーザー登録

```bash
curl -X POST https://your-backend-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sales.com",
    "password": "admin123",
    "full_name": "管理者",
    "role": "admin"
  }'
```

---

## 🐛 トラブルシューティング

### CORS エラー

**症状**: フロントエンドからAPIリクエストが失敗

**解決策**:
1. バックエンドの`CORS_ORIGIN`環境変数を確認
2. フロントエンドの正確なURLを設定（トレーリングスラッシュなし）
3. バックエンドを再デプロイ

### 認証エラー

**症状**: ログイン後すぐにログアウトされる

**解決策**:
1. `JWT_SECRET`が設定されているか確認
2. クッキーの設定を確認（SameSite、Secure属性）
3. HTTPSを使用していることを確認

### ビルドエラー

**症状**: デプロイ時にビルドが失敗

**解決策**:
1. ローカルで`npm run build`を実行して確認
2. `package.json`の依存関係を確認
3. Node.jsのバージョンを確認（`.node-version`ファイル作成推奨）

### データベース接続エラー

**症状**: `/tmp/sales.db`へのアクセスエラー

**解決策**:
- Vercelのサーバーレス環境ではSQLiteは永続化されません
- 上記の「データベース移行」セクションを参照してPostgreSQLに移行

---

## 📊 パフォーマンス最適化

### 1. CDNキャッシング

Vercelは自動的にCDNキャッシングを提供します。

### 2. 画像最適化

`next/image`コンポーネントを使用（Nextに移行する場合）

### 3. コード分割

Reactの`lazy`と`Suspense`を使用：

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## 🔐 セキュリティチェックリスト

- [ ] `JWT_SECRET`を強力なランダム文字列に設定
- [ ] `NODE_ENV=production`を設定
- [ ] CORS設定を本番URLのみに制限
- [ ] HTTPSを使用
- [ ] 環境変数に機密情報を保存（コードに含めない）
- [ ] レート制限を実装（express-rate-limitなど）
- [ ] セキュリティヘッダーを設定（Helmet）

---

## 📝 カスタムドメインの設定

### Vercelでカスタムドメインを追加

1. Vercelダッシュボードで「Settings」→「Domains」
2. ドメイン名を入力（例: `api.yourdomain.com`、`app.yourdomain.com`）
3. DNSレコードを設定（Vercelが指示を表示）

### DNS設定例

**バックエンド**（api.yourdomain.com）：
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

**フロントエンド**（app.yourdomain.com）：
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

---

## 🎉 完了！

おめでとうございます！Sales Management SystemがVercelにデプロイされました。

### 次のステップ

1. カスタムドメインの設定
2. PostgreSQLへの移行（本番環境用）
3. モニタリングとログの設定
4. バックアップ戦略の実装

---

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

---

**質問があれば、Vercelのサポートまたはプロジェクトドキュメントを参照してください！**
