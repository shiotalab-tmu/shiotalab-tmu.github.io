#!/usr/bin/env tsx
/**
 * 論文データベースからmarkdownファイルを生成するスクリプト
 *
 * 使用方法:
 *   npm run generate:papers
 *
 * 環境変数:
 *   BUNKEN_API_URL: APIのベースURL (デフォルト: http://localhost:8000)
 */

import { writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PaperTitle {
  japanese: string | null;
  english: string | null;
}

interface AuthorName {
  japanese: string;
  english: string;
}

interface Author {
  id: number;
  name: AuthorName;
  order: number;
}

interface JournalName {
  japanese: string | null;
  english: string | null;
}

interface Journal {
  id: number;
  name: JournalName;
  type: string;
}

interface Pages {
  begin: number | null;
  end: number | null;
  pnum: string | null;
}

interface Urls {
  japanese: string | null;
  english: string | null;
  presentation_pdf: string | null;
  review_pdf: string | null;
}

interface Paper {
  id: number;
  title: PaperTitle;
  authors: Author[];
  journal: Journal | null;
  date: string;
  volume: string | null;
  number: number | null;
  pages: Pages;
  place: string | null;
  doi: string | null;
  urls: Urls;
  language: string;
}

/**
 * APIのベースURLを取得
 */
function getApiUrl(): string {
  return process.env.BUNKEN_API_URL || 'http://localhost:8000';
}

/**
 * 出力先ディレクトリのパスを取得
 */
function getOutputDir(): string {
  return join(__dirname, '..', 'src', 'content', 'papers');
}

/**
 * APIから論文データを取得
 */
async function fetchPapers(): Promise<Paper[]> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/papers`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * DBのptypeをAstroのtypeにマッピング
 */
function mapPtypeToType(ptype: string): 'journal' | 'international' | 'domestic' {
  const mapping: Record<string, 'journal' | 'international' | 'domestic'> = {
    'gakuari': 'journal',    // 査読あり論文誌
    'gakunashi': 'journal',  // 査読なし論文誌
    'kokuari': 'international', // 国際会議
    'kounashi': 'domestic',  // 国内会議
  };
  return mapping[ptype] || 'domestic';
}

/**
 * ファイル名として使用できる文字列に変換
 */
function sanitizeFilename(text: string, maxLength: number = 50): string {
  // 制御文字や不適切な文字を削除
  let sanitized = text.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
  // カンマとピリオドを削除
  sanitized = sanitized.replace(/[,.]/g, '');
  // 長すぎる場合は切り詰め
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  return sanitized.trim();
}

/**
 * 論文データからファイル名を生成
 * 形式: YYYY-{paper_id:03d}-{type}-{title}.md
 */
function generateFilename(paper: Paper): string {
  // 年を取得
  const year = paper.date.slice(0, 4);

  // IDを取得 (3桁にパディング)
  const paperId = String(paper.id).padStart(3, '0');

  // typeを取得
  const paperType = paper.journal
    ? mapPtypeToType(paper.journal.type)
    : 'domestic';

  // タイトルを取得 (英語優先、なければ日本語)
  const title = paper.title.english || paper.title.japanese || 'untitled';
  const sanitizedTitle = sanitizeFilename(title);

  return `${year}-${paperId}-${paperType}-${sanitizedTitle}.md`;
}

/**
 * venueフィールドの文字列を構築
 */
function buildVenueString(paper: Paper): string {
  const parts: string[] = [];

  // ジャーナル/学会名
  if (paper.journal) {
    const journalName = paper.journal.name.english || paper.journal.name.japanese;
    if (journalName) {
      parts.push(journalName);
    }
  }

  // Volume/Number
  if (paper.volume) {
    let volStr = `Vol. ${paper.volume}`;
    if (paper.number) {
      volStr += `, No. ${paper.number}`;
    }
    parts.push(volStr);
  }

  // Pages
  if (paper.pages.pnum) {
    parts.push(`pp. ${paper.pages.pnum}`);
  } else if (paper.pages.begin && paper.pages.end) {
    parts.push(`pp. ${paper.pages.begin}-${paper.pages.end}`);
  } else if (paper.pages.begin) {
    parts.push(`p. ${paper.pages.begin}`);
  }

  // Place
  if (paper.place) {
    parts.push(paper.place);
  }

  // Date
  if (paper.date) {
    parts.push(paper.date);
  }

  return parts.join(', ') + '.';
}

/**
 * 制御文字を削除してクリーンな文字列に変換
 */
function cleanString(str: string): string {
  // 制御文字 (0x00-0x1F, 0x7F) を削除
  // ただし、タブ(\t), 改行(\n), キャリッジリターン(\r) は保持
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * 論文データからmarkdownコンテンツを生成
 */
function generateMarkdown(paper: Paper): string {
  // タイトル (英語優先)
  const title = cleanString(paper.title.english || paper.title.japanese || 'Untitled');

  // 著者リスト
  const authors = paper.authors
    .sort((a, b) => a.order - b.order)
    .map(author => cleanString(author.name.english || author.name.japanese));

  // 年
  const year = parseInt(paper.date.slice(0, 4));

  // type
  const paperType = paper.journal
    ? mapPtypeToType(paper.journal.type)
    : 'domestic';

  // venue
  const venue = cleanString(buildVenueString(paper));

  // リンク各種(旧サイト準拠: DOI / webpage / Publish / Local)
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const webpage = paper.urls.english || paper.urls.japanese;
  const publish = paper.urls.presentation_pdf;
  // rpdfurlは絶対URLのみ使用(相対パスの旧ローカルパスは出さない)
  let local: string | null = paper.urls.review_pdf?.trim() || null;
  if (local && !/^https?:\/\//.test(local)) {
    local = null;
  }

  // 後方互換の単一URL (優先順位: DOI > eurl > jurl > ppdfurl)
  const url = doi || webpage || publish;

  // Frontmatterオブジェクトを構築
  const frontmatter: Record<string, any> = {
    title,
    authors,
    year,
    type: paperType,
    venue,
  };

  if (url) {
    frontmatter.url = url;
  }
  if (doi) {
    frontmatter.doi = doi;
  }
  if (webpage) {
    frontmatter.webpage = webpage;
  }
  if (publish) {
    frontmatter.publish = publish;
  }
  if (local) {
    frontmatter.local = local;
  }

  // js-yamlで安全にYAMLに変換
  const yamlString = yaml.dump(frontmatter, {
    lineWidth: -1,  // 行の折り返しを無効化
    noRefs: true,   // 参照を使わない
    quotingType: '"', // ダブルクォートを使用
    forceQuotes: true, // すべての文字列をクォート
  });

  return `---\n${yamlString}---\n`;
}

/**
 * メイン処理
 */
async function main() {
  try {
    console.log('📚 論文データを取得中...');
    const papers = await fetchPapers();
    console.log(`✅ ${papers.length}件の論文データを取得しました`);

    // 出力先ディレクトリを準備
    const outputDir = getOutputDir();
    await mkdir(outputDir, { recursive: true });
    console.log(`📁 出力先: ${outputDir}`);

    // 既存のファイルを削除
    const existingFiles = await readdir(outputDir);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        await unlink(join(outputDir, file));
      }
    }
    console.log('🗑️  既存のファイルを削除しました');

    // 各論文のmarkdownを生成
    let successCount = 0;
    for (const paper of papers) {
      try {
        const filename = generateFilename(paper);
        const filepath = join(outputDir, filename);
        const markdownContent = generateMarkdown(paper);

        await writeFile(filepath, markdownContent, 'utf-8');
        successCount++;
      } catch (error) {
        console.error(`⚠️  論文ID ${paper.id} の処理に失敗:`, error);
        continue;
      }
    }

    console.log(`✨ ${successCount}/${papers.length}件のmarkdownファイルを生成しました`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main();