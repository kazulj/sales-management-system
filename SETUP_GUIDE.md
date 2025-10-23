# 🚀 Sales Management System - セットアップガイド

## ✅ 実装済みの機能

### フロントエンド
- ✅ モダンなログインページ（グラデーション背景、アニメーション）
- ✅ レスポンシブなサイドバーレイアウト
- ✅ 美しいダッシュボード（KPIカード、Rechartsグラフ）
- ✅ 型安全なTypeScript実装
- ✅ Zustandによる状態管理
- ✅ Toast通知システム
- ✅ Tailwind CSSカスタムスタイル

### バックエンド
- ✅ Express + TypeScript サーバー
- ✅ SQLiteデータベース
- ✅ JWT認証システム
- ✅ セキュアなパスワードハッシュ化

## 📦 インストール手順

### 1. 依存関係のインストール

```bash
cd /home/kazuki/sales-management-system

# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

### 2. 環境変数の設定

```bash
cd backend
cp .env.example .env
```

`.env`ファイルを編集：
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
DATABASE_PATH=./database/sales.db
CORS_ORIGIN=http://localhost:5173
```

### 3. データベースの初期化

バックエンドを起動すると自動的にデータベースが作成されます。

### 4. サーバーの起動

**ターミナル1（バックエンド）：**
```bash
cd backend
npm run dev
```

**ターミナル2（フロントエンド）：**
```bash
cd frontend
npm run dev
```

## 🎯 アクセス方法

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:5000

## 🔐 ログイン情報

初期設定ではデフォルトのadminユーザーは存在しません。
最初のユーザーを登録する必要があります。

### ユーザー登録方法

ログインページに登録機能を追加するか、APIを直接呼び出します：

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sales.com",
    "password": "admin123",
    "full_name": "管理者",
    "role": "admin"
  }'
```

その後、以下の情報でログインできます：
- **Email**: admin@sales.com
- **Password**: admin123

## 🎨 実装済みのUI機能

### ダッシュボード
- ✅ 4つのKPIカード（売上、顧客、商品）
- ✅ 月次売上推移グラフ（Line Chart）
- ✅ カテゴリ別売上分布（Pie Chart）
- ✅ 最近の売上テーブル
- ✅ ホバーエフェクトとアニメーション
- ✅ レスポンシブデザイン

### レイアウト
- ✅ サイドバーナビゲーション
- ✅ ユーザー情報表示
- ✅ ログアウト機能
- ✅ モバイル対応メニュー

### ログインページ
- ✅ グラデーション背景
- ✅ フェードイン・スライドアニメーション
- ✅ フォームバリデーション
- ✅ ローディング状態表示

## 📝 次に実装すべき機能

現在、以下のページは「Coming Soon」状態です：

1. **売上管理ページ** (`/sales`)
   - 売上一覧テーブル
   - 売上登録フォーム
   - 売上編集・削除機能

2. **顧客管理ページ** (`/customers`)
   - 顧客一覧
   - 顧客登録・編集

3. **商品管理ページ** (`/products`)
   - 商品カタログ
   - 在庫管理

4. **レポートページ** (`/reports`)
   - 月次・年次レポート
   - CSVエクスポート

これらを実装するには、まず対応するバックエンドAPIルートが必要です。

## 🔧 バックエンドAPI追加実装

必要なAPIルート：

1. `/backend/src/routes/sales.ts` - 売上CRUD
2. `/backend/src/routes/customers.ts` - 顧客CRUD
3. `/backend/src/routes/products.ts` - 商品CRUD
4. `/backend/src/routes/reports.ts` - レポート生成

これらのファイルを作成し、`/backend/src/index.ts`にインポートする必要があります。

## 🐛 トラブルシューティング

### ポートが使用中の場合

```bash
# バックエンドのポートを変更
PORT=5001 npm run dev

# フロントエンドのポートを変更（vite.config.tsで設定）
```

### データベースエラー

```bash
# データベースファイルを削除して再作成
rm backend/database/sales.db
# サーバーを再起動すると自動で再作成されます
```

## 📚 技術スタック

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator

## 🎉 完了！

基本的なシステムが動作する状態になりました。
ブラウザで http://localhost:5173 にアクセスして確認してください。

---

**質問があれば、お気軽にお問い合わせください！**
