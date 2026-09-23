type PaperType = 'journal' | 'international' | 'domestic';
type SiteLang = 'ja' | 'en';

interface PaperDisplayData {
  type: PaperType;
  titleJa?: string;
  titleEn?: string;
  authorsJa: string[];
  authorsEn: string[];
  venueJa: string;
  venueEn: string;
  place?: string;
}

// journal/international は常に英語表記、domestic はサイト言語に追従（旧サイト www-isys.sd.tmu.ac.jp 準拠）
function resolveLang(type: PaperType, siteLang: SiteLang): SiteLang {
  return type === 'domestic' ? siteLang : 'en';
}

export function paperTitle(paper: PaperDisplayData, siteLang: SiteLang): string {
  const lang = resolveLang(paper.type, siteLang);
  return lang === 'ja' ? (paper.titleJa ?? paper.titleEn ?? '') : (paper.titleEn ?? paper.titleJa ?? '');
}

export function paperAuthors(paper: PaperDisplayData, siteLang: SiteLang): string[] {
  const lang = resolveLang(paper.type, siteLang);
  return lang === 'ja' ? paper.authorsJa : paper.authorsEn;
}

export function paperVenue(paper: PaperDisplayData, siteLang: SiteLang): string {
  const lang = resolveLang(paper.type, siteLang);
  const venue = lang === 'ja' ? (paper.venueJa || paper.venueEn) : (paper.venueEn || paper.venueJa);

  // 英語ページではすべて、日本語ページでは国内学会論文以外の開催地を表示しない。
  if (siteLang === 'en' || paper.type !== 'domestic' || !paper.place) {
    return venue;
  }

  return venue.replace(/(,?\s*\d{4}-\d{2}-\d{2}\.)$/, `, ${paper.place}$1`);
}
