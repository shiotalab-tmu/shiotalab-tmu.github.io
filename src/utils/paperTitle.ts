interface PaperTitleData {
  titleJa?: string;
  titleEn?: string;
}

/** 日本語ページ用: 日本語タイトル優先、なければ英語 */
export function paperTitleJa(paper: PaperTitleData): string {
  return paper.titleJa ?? paper.titleEn ?? '';
}

/** 英語ページ用: 英語タイトル優先、なければ日本語 */
export function paperTitleEn(paper: PaperTitleData): string {
  return paper.titleEn ?? paper.titleJa ?? '';
}
