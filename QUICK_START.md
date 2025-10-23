# 🚀 クイックスタートガイド

このプロジェクトは現在、基盤となるコア機能が実装されています。
完全に動作させるには、以下の手順に従ってください。

## ⚠️ 現状

### ✅ 実装済み
- データベーススキーマ（SQLite）
- 認証API（JWT）
- バックエンド基盤（Express + TypeScript）
- フロントエンド設定（Vite + React + Tailwind CSS）
- プロジェクト構造

### 🚧 未実装（追加実装が必要）
- 売上・顧客・商品のCRUD APIルート
- Reactページコンポーネント
- ダッシュボードとグラフ
- 型定義とストア管理
- エクスポート機能

## 📝 次のステップ

このシステムを完全に動作させるには、以下のファイルを追加で実装する必要があります：

### バックエンド（約2000行）
1. `/backend/src/routes/sales.ts` - 売上CRUD API
2. `/backend/src/routes/customers.ts` - 顧客CRUD API
3. `/backend/src/routes/products.ts` - 商品CRUD API
4. `/backend/src/routes/reports.ts` - レポートAPI

### フロントエンド（約5000行）
1. `/frontend/src/types/index.ts` - 型定義
2. `/frontend/src/store/authStore.ts` - 認証ストア
3. `/frontend/src/services/api.ts` - API通信
4. `/frontend/src/components/Layout.tsx` - レイアウト
5. `/frontend/src/pages/Dashboard.tsx` - ダッシュボード
6. `/frontend/src/pages/Sales.tsx` - 売上管理
7. `/frontend/src/pages/Customers.tsx` - 顧客管理
8. `/frontend/src/pages/Products.tsx` - 商品管理
9. `/frontend/src/pages/Reports.tsx` - レポート
10. `/frontend/src/App.tsx` - メインアプリ
11. `/frontend/src/main.tsx` - エントリーポイント

## 💡 推奨される実装方法

このような大規模プロジェクトは、1つの応答では提供できません。
以下のいずれかの方法をお勧めします：

### オプション1: 段階的実装
各部分を個別にリクエストしてください：
- "バックエンドのsales.tsルートを実装してください"
- "フロントエンドのDashboard.tsxを実装してください"

### オプション2: 簡易版の実装
機能を絞った簡易版（MVP）の実装をリクエストしてください。

### オプション3: テンプレートの使用
既存のReact + TypeScriptテンプレートをベースに、
カスタマイズを加える方法もあります。

## 🔧 現在の使用方法

現時点で動作する部分：

```bash
# 1. 依存関係のインストール
cd backend && npm install
cd ../frontend && npm install

# 2. バックエンドの起動
cd backend
cp .env.example .env
npm run dev

# 3. 認証APIのテスト
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'
```

---

**ご質問やご要望があれば、お知らせください。**
**段階的に実装を進めることができます。**
