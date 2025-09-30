# 塩田・貴家研究室 ホームページ

東京都立大学 塩田・貴家研究室のウェブサイトのリポジトリ。

## 概要

- **フレームワーク**: Astro + TypeScript
- **コンテンツ管理**: Markdown CMS
- **デザイン**: レスポンシブ対応
- **論文管理**: 年度別自動分類・表示

## クイックスタート

### 開発環境のセットアップ
何らかの手法でNode20以上を入れてください。
```bash
# リポジトリのクローン
git clone https://github.com/shiotalab-tmu/shiotalab-tmu.github.io.git
cd shiotalab-tmu.github.io

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev  # http://localhost:4321
```

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド版プレビュー |
| `npm run generate:papers` | 論文データベースからMarkdownを生成(bunkenから自動実行) |

## デプロイメント

### GitHub Pages への自動デプロイ

このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

**デプロイURL**: https://shiotalab-tmu.github.io/

#### 自動デプロイの流れ
1. `main`ブランチにプッシュまたはマージ
2. GitHub Actionsが自動実行
3. プロジェクトをビルド
4. GitHub Pagesにデプロイ

## ドキュメント
適当に操作しても壊れないようにブランチは適切に保護されているので、gitに慣れるつもりで操作してみることをお勧めします。
- **[コンテンツ管理ガイド](docs/CONTENT_GUIDE.md)**: 基本的なコンテンツ更新方法
- **[論文追加ガイド](docs/add-paper.md)**: 新しい論文の追加手順（詳細版）

## プロジェクト構造

```
├── docs/                 # プロジェクトドキュメント
├── public/images/        # 静的画像ファイル
├── scripts/              # ユーティリティスクリプト
└── src/
    ├── content/          # コンテンツ（Markdown）
    │   ├── members/      # メンバー情報（個別詳細）
    │   ├── memberlist/   # メンバー一覧（構造化）
    │   ├── research/     # 研究内容
    │   ├── papers/       # 論文情報（年度別自動分類）
    │   ├── awards/       # 受賞情報
    │   ├── graduates/    # 卒業生・修了生
    │   └── config.ts     # コレクション定義とスキーマ
    ├── pages/            # ページテンプレート（日本語）
    │   ├── en/           # 英語版ページ
    │   └── papers/       # 論文動的ルーティング
    │       └── [year].astro  # 年度別論文表示
    ├── layouts/          # レイアウトテンプレート
    └── components/       # 再利用可能コンポーネント
```

## 技術スタック

- **フレームワーク**: Astro 5.13.5
- **コンテンツ**: Markdown with Frontmatter

## 主要機能

### 論文管理システム
- **データベース連携**: PostgreSQLベースの論文データベース（bunken）と連携
- **自動Markdown生成**: APIからデータを取得してMarkdownファイルを自動生成
- **年度別自動分類**: 論文は年度ごとに自動分類・表示
- **動的ルーティング**: `/papers/{year}` で年度別アクセス
- **自動リダイレクト**: `/papers` → 最新年度にリダイレクト
- **分類別表示**: 学術論文・国際学会論文・学会講演論文に分類
- **年号対応**: 昭和・平成・令和の年号を自動計算

#### 論文データの更新方法

論文データは`bunken`という論文管理システムで管理されています。

**1. 論文データベースの起動**

```bash
cd bunken
docker-compose up -d
```

**2. 論文管理画面にアクセス**

http://localhost:8000 で論文の追加・編集・削除が可能です。

**3. Markdownファイルの生成**

論文データを更新した後、以下のコマンドでMarkdownファイルを再生成します：

```bash
# ホームページプロジェクトのルートディレクトリで実行
npm run generate:papers
```

このコマンドは以下の処理を行います：
- `bunken` APIから論文データを取得（http://localhost:8000/api/papers）
- 既存のMarkdownファイルを全て削除
- 全論文のMarkdownファイルを再生成（`src/content/papers/` 配下）
- ファイル名形式: `YYYY-{id:03d}-{type}-{title}.md`
- type: `journal`（学術論文）, `international`（国際会議）, `domestic`（国内会議）

**環境変数**

APIのURLをカスタマイズする場合：

```bash
BUNKEN_API_URL=http://custom-host:8000 npm run generate:papers
```

**定期実行**

論文データを定期的に同期する場合は、以下の方法があります：
- **cron**: サーバー上でcronジョブとして実行
- **GitHub Actions**: ワークフローで定期実行してcommit & push

**詳細**

論文管理システムの詳細は `bunken/README.md` を参照してください。

### メンバー管理
- **構造化データ**: 教員・学生・卒業生を分離管理
- **個別詳細ページ**: メンバー個別の詳細情報
- **多言語対応**: 日英両言語での表示

### レスポンシブデザイン
- **モバイルファースト**: スマートフォン優先設計
- **グリッドレイアウト**: 柔軟なレスポンシブ配置

## 開発ワークフロー

### コンテンツ更新の基本フロー
1. **ブランチ作成**: `git checkout -b feature/new-content`
2. **コンテンツ編集**: Markdownファイルの編集
3. **ローカル確認**: `npm run dev` で動作確認
4. **ビルドテスト**: `npm run build` でエラーチェック
5. **PR作成**: GitHubでPull Request作成
6. **レビュー・マージ**: 承認後にマージ

### コンテンツの種類と更新方法
- **論文**: 上記の「論文管理システム」セクションを参照（データベース経由での管理）
- **メンバー**: [基本ガイド](docs/CONTENT_GUIDE.md)のメンバー管理セクションを参照
- **その他**: [基本ガイド](docs/CONTENT_GUIDE.md)を参照

## 関連プロジェクト

### bunken - 論文管理システム

論文データを管理するための独立したWebアプリケーション。

- **場所**: `bunken/` ディレクトリ
- **技術**: FastAPI + PostgreSQL + Jinja2
- **機能**: 論文・著者・学会の登録管理、JSON API提供
- **詳細**: `bunken/README.md` を参照
