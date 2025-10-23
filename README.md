# 🚀 Sales Management System

モダンで洗練された売上管理システム - React + TypeScript + Express + SQLite

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## ✨ 主な機能

### 📊 ダッシュボード
- リアルタイム売上概要
- インタラクティブなグラフとチャート（Recharts）
- KPI表示（売上、利益、顧客数など）
- 月次・年次トレンド分析

### 💰 売上管理
- 売上データの登録・編集・削除
- 詳細な売上明細管理
- ステータス管理（完了、保留、キャンセル、返金）
- 検索・フィルタリング機能
- ページネーション

### 👥 顧客管理
- 顧客情報の登録・編集・削除
- 顧客ごとの売上履歴
- 連絡先情報管理

### 📦 商品/サービス管理
- 商品カタログ管理
- 在庫管理
- カテゴリ分類
- 価格・原価管理

### 📈 レポート機能
- 月次売上レポート
- 年次売上レポート
- 商品別売上分析
- 顧客別売上分析
- データエクスポート（CSV、PDF）

### 🔐 認証・セキュリティ
- JWT認証
- ロールベースアクセス制御（Admin, Manager, User）
- セキュアなパスワード管理

### 🎨 UI/UX
- モダンでプロフェッショナルなデザイン
- レスポンシブデザイン（モバイル対応）
- Tailwind CSSによるスタイリング
- スムーズなアニメーション効果
- Lucide Reactアイコン

## 🛠️ 技術スタック

### フロントエンド
- **React 18.2** - UIライブラリ
- **TypeScript 5.3** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **React Router** - ルーティング
- **Zustand** - 状態管理
- **Axios** - HTTP クライアント
- **Recharts** - グラフライブラリ
- **React Hot Toast** - 通知システム
- **Lucide React** - アイコンライブラリ

### バックエンド
- **Node.js 18+** - ランタイム
- **Express 4.18** - Webフレームワーク
- **TypeScript 5.3** - 型安全性
- **Better-SQLite3** - データベース
- **JWT** - 認証
- **Bcrypt** - パスワードハッシュ化
- **Helmet** - セキュリティヘッダー
- **Morgan** - ロギング
- **Express Validator** - バリデーション

## 📁 プロジェクト構造

```
sales-management-system/
├── frontend/                 # Reactフロントエンド
│   ├── src/
│   │   ├── components/      # 再利用可能なコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── services/        # API通信
│   │   ├── hooks/           # カスタムフック
│   │   ├── store/           # Zustand ストア
│   │   ├── types/           # TypeScript型定義
│   │   └── utils/           # ユーティリティ関数
│   ├── public/              # 静的ファイル
│   └── package.json
├── backend/                  # Express バックエンド
│   ├── src/
│   │   ├── routes/          # APIルート
│   │   ├── models/          # データモデル
│   │   ├── middleware/      # ミドルウェア
│   │   ├── config/          # 設定ファイル
│   │   └── utils/           # ユーティリティ関数
│   ├── database/            # データベーススキーマ
│   │   ├── schema.sql       # テーブル定義
│   │   └── seed.sql         # 初期データ
│   └── package.json
└── README.md                # このファイル
```

## 🚀 セットアップ手順

### 前提条件
- Node.js 18以上
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd sales-management-system
```

### 2. 依存関係のインストール
```bash
# ルート、バックエンド、フロントエンドの全ての依存関係をインストール
npm run setup
```

### 3. 環境変数の設定
```bash
# バックエンドの環境変数ファイルをコピー
cd backend
cp .env.example .env

# .envファイルを編集して、必要な値を設定
# 特にJWT_SECRETは本番環境で必ず変更してください
```

### 4. データベースの初期化
```bash
# バックエンドディレクトリで実行
npm run db:migrate
```

### 5. 開発サーバーの起動
```bash
# プロジェクトルートで実行（バックエンドとフロントエンドを同時起動）
npm run dev

# または個別に起動
npm run dev:backend  # バックエンドのみ
npm run dev:frontend # フロントエンドのみ
```

### 6. アプリケーションへのアクセス
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:5000

### デフォルトログイン情報
- Email: `admin@sales.com`
- Password: `admin123`

## 📦 ビルドとデプロイ

### 本番環境用ビルド
```bash
npm run build
```

### 本番環境での起動
```bash
npm start
```

## 🔧 開発

### コーディング規約
- ESLint + TypeScriptルールに従う
- コンポーネントは機能ごとにディレクトリ分け
- 型定義は必須
- コメントは英語または日本語で記述

### Git ワークフロー
```bash
# feature ブランチを作成
git checkout -b feature/your-feature-name

# 変更をコミット
git add .
git commit -m "Add: your feature description"

# mainブランチにマージ
git checkout main
git merge feature/your-feature-name
```

## 📝 API ドキュメント

### 認証エンドポイント
- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - ユーザー登録
- `GET /api/auth/me` - 現在のユーザー情報

### 売上エンドポイント
- `GET /api/sales` - 売上一覧取得
- `GET /api/sales/:id` - 売上詳細取得
- `POST /api/sales` - 売上作成
- `PUT /api/sales/:id` - 売上更新
- `DELETE /api/sales/:id` - 売上削除

### 顧客エンドポイント
- `GET /api/customers` - 顧客一覧取得
- `GET /api/customers/:id` - 顧客詳細取得
- `POST /api/customers` - 顧客作成
- `PUT /api/customers/:id` - 顧客更新
- `DELETE /api/customers/:id` - 顧客削除

### 商品エンドポイント
- `GET /api/products` - 商品一覧取得
- `GET /api/products/:id` - 商品詳細取得
- `POST /api/products` - 商品作成
- `PUT /api/products/:id` - 商品更新
- `DELETE /api/products/:id` - 商品削除

### レポートエンドポイント
- `GET /api/reports/dashboard` - ダッシュボード統計
- `GET /api/reports/monthly` - 月次レポート
- `GET /api/reports/yearly` - 年次レポート
- `GET /api/reports/export/csv` - CSVエクスポート

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 👨‍💻 作成者

Sales Management System Development Team

## 🙏 謝辞

- React チーム
- Express チーム
- Tailwind CSS チーム
- すべてのオープンソースコントリビューター

---

**Built with ❤️ using React, TypeScript, and Express**
