# コンテンツ更新ガイド

このドキュメントでは、ウェブサイトのコンテンツを更新する基本的な方法を説明します。
**詳細な手順は、各専用ガイドを参照してください。**

## 📖 重要なお知らせ

**論文データの管理方法が変更されました！**

論文データは現在、`bunken`という専用の論文管理システムで管理されています。
手動でMarkdownファイルを編集する必要はありません。

詳細は[README.md](../README.md)の「論文管理システム」セクションを参照してください。

## 📁 コンテンツ構造

```
src/content/
├── members/      # メンバー個別詳細ページ
├── memberlist/   # メンバー一覧（構造化データ）
├── research/     # 研究内容
├── papers/       # 論文情報（⚠️ bunkenシステムから自動生成）
├── awards/       # 受賞情報
└── graduates/    # 卒業生・修了生の就職先
```

**注意**: `papers/` ディレクトリ内のファイルは手動編集しないでください。
これらは `npm run generate:papers` コマンドで自動生成されます。

## Frontmatter スキーマ

### Members（個別詳細ページ）

```typescript
{
  name: string;           // 日本語名
  nameEn?: string;        // 英語名
  role: string;           // 役職
  photo?: string;         // 写真パス
  email?: string;
  research?: string[];    // 研究分野
  order: number;         // 表示順序（デフォルト: 999）
}
```

### MemberList（構造化一覧データ）

```typescript
{
  faculty: {
    name: string;
    nameEn?: string;
    role: string;         // 日本語役職
    roleEn: string;       // 英語役職
    slug: string;         // 詳細ページへのリンク
  }[];
  students: {
    section: string;      // セクション名（日本語）
    sectionEn: string;    // セクション名（英語）
    members: {
      name: string;
      nameEn?: string;
      year: string;       // 学年・年度
    }[];
  }[];
  alumni: {
    name: string;
    nameEn: string;
    affiliation: string;  // 所属（日本語）
    affiliationEn: string; // 所属（英語）
    url: string;         // リンクURL
  }[];
}
```

### Papers（年度別自動分類システム）

```typescript
{
  title: string;        // 論文タイトル
  authors: string[];    // 著者リスト
  year: number;        // 発表年（西暦）
  type: 'journal' | 'international' | 'domestic';
  venue: string;       // 掲載先詳細
  url?: string;        // 論文URL（任意）
}
```

**重要**: 論文データは `bunken` システムで管理されており、手動で編集する必要はありません。
- 論文の追加・編集・削除: http://localhost:8000 の管理画面で操作
- Markdownファイルの生成: `npm run generate:papers` で自動生成
- 詳細: [README.md](../README.md) の「論文管理システム」セクションを参照

### Research

```typescript
{
  title: string;
  titleEn: string;
  description: string;
  image?: string;
  order: number;
}
```

### Awards（index.mdで一元管理）

```typescript
{
  title: string;
  recipient: string;
  year: number;
  organization: string;
}
```

**重要**: 受賞情報は `awards/index.md` のみで管理されます。
個別ファイルは使用しません。

### Graduates

```typescript
{
  title: string;           // 日本語タイトル
  titleEn: string;         // 英語タイトル
  description: string;     // 日本語説明
  descriptionEn: string;   // 英語説明
}
```

## ファイル名規則

- 英数字・ハイフン・アンダースコアのみ
- 拡張子は `.md`
- 例: `yamada-taro.md`, `2024-best-paper.md`
- memberlist, graduates は `index.md` を使用

## 重要な更新手順

### メンバー一覧の更新
1. `src/content/memberlist/index.md` を編集（日本語版のみ必須）
2. faculty, students, alumni セクションを更新
3. 新規メンバーの個別ページは `src/content/members/` に作成

**注意**: 英語版ファイルは存在しますが、TODO状態です。

### 卒業生・修了生の就職先更新
1. `src/content/graduates/index.md` を編集
2. 業界別カテゴリ（メーカー、教育・研究、通信・マスコミ、その他）で整理
3. 日本語版のみ管理（英語版はTODO状態）

### 論文の更新

**論文データは `bunken` システムで管理されます。**

#### 更新手順

1. **論文データベースを起動**
   ```bash
   cd bunken
   docker-compose up -d
   ```

2. **管理画面で論文を追加・編集・削除**
   - URL: http://localhost:8000
   - 著者・学会・論文の登録が可能

3. **Markdownファイルを再生成**
   ```bash
   # ホームページプロジェクトのルートで実行
   npm run generate:papers
   ```

4. **動作確認**
   ```bash
   npm run dev  # http://localhost:4321/papers
   ```

#### システムの特徴
- **自動生成**: DBから全論文データを取得して自動生成
- **ファイル名規則**: `{年度}-{ID:3桁}-{タイプ}-{タイトル}.md`
- **年度別自動分類**: 年度ごとに自動でページ生成・表示
- **動的ルーティング**: `/papers/{年度}` 形式でアクセス
- **自動リダイレクト**: `/papers` は最新年度に自動転送
- **年号対応**: 昭和・平成・令和を自動計算・表示
- **詳細**: [README.md](../README.md) の「論文管理システム」セクション

### 受賞情報の更新
1. `src/content/awards/index.md` で一元管理
2. Markdownリストとして直接編集

## 画像管理

- 配置: `public/images/`
- 参照: `images/filename.jpg`
- 推奨: JPEG（写真）、PNG（図表）

## 開発・ビルドコマンド

```bash
npm run dev              # 開発サーバー起動 (http://localhost:4321)
npm run build            # 本番ビルド
npm run preview          # ビルド版プレビュー
npm run generate:papers  # 論文Markdown自動生成
```

## 論文管理システム (bunken)

```bash
# データベース起動
cd bunken
docker-compose up -d

# 管理画面アクセス
# http://localhost:8000

# Markdown生成
cd ..  # ホームページプロジェクトのルートに戻る
npm run generate:papers
```

詳細は [README.md](../README.md) の「論文管理システム」セクションを参照してください。

## スキーマ検証

すべてのコンテンツは `src/content/config.ts` で定義されたスキーマに従って検証されます。
不正なデータがある場合、ビルド時にエラーが表示されます。
