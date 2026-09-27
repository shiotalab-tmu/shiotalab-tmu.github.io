import { getCollection, type CollectionEntry } from 'astro:content';

export type MemberSectionEntry = CollectionEntry<'member-sections'>;
export type MemberSectionEnEntry = CollectionEntry<'member-sections-en'>;
export type PaperType = 'journal' | 'international' | 'domestic';
type Lang = 'ja' | 'en';

/** 指定メンバーの追加セクションを取得する(slugは "kiya-hitoshi/invited" のような形。並び順は memberPageItems 側で決める) */
export async function getMemberSections(memberSlug: string): Promise<MemberSectionEntry[]> {
  const all = await getCollection('member-sections');
  return all.filter((s) => s.slug.startsWith(`${memberSlug}/`));
}

/** 指定メンバーの英語専用の本文(あるファイルだけ)を、ファイル名 → エントリ のMapで取得する */
export async function getMemberSectionsEn(memberSlug: string): Promise<Record<string, MemberSectionEnEntry>> {
  const all = await getCollection('member-sections-en');
  const map: Record<string, MemberSectionEnEntry> = {};
  for (const s of all) {
    if (s.slug.startsWith(`${memberSlug}/`)) {
      map[memberSectionKey(s)] = s;
    }
  }
  return map;
}

/** セクションのURL上の名前(ファイル名)。例: "invited" */
export function memberSectionKey(section: { slug: string }): string {
  return section.slug.split('/').pop()!;
}

// 旧サイト(www-isys.sd.tmu.ac.jp/kiya/)に合わせた論文種別の名前
export const paperTypeLabels: Record<PaperType, Record<Lang, string>> = {
  journal: { ja: '学術論文', en: 'Journal' },
  international: { ja: '国際会議論文', en: 'International conference' },
  domestic: { ja: '学会講演論文', en: 'Domestic conference' },
};
const paperTypes: PaperType[] = ['journal', 'international', 'domestic'];

/** 個別ページ1つ分の情報 */
export type MemberPageItem =
  | { key: PaperType; kind: 'papers'; group: 'papers'; label: string; paperType: PaperType }
  | { key: string; kind: 'section'; group: 'intro' | 'papers' | 'other'; label: string; section: MemberSectionEntry | MemberSectionEnEntry };

/**
 * 目次に並ぶ個別ページの一覧(表示順)。
 * group:'intro'(履歴など) → 研究業績[論文3種(自動) → group:'papers'] → group:'other'
 * 英語ページは旧サイト(www-isys.sd.tmu.ac.jp/members-2/kiya/)の構成に合わせるため、
 * groupEn/orderEn(目次上の分類・並び順)や enAvailable(除外)、member-sections-en(本文差し替え)で調整する
 */
export function memberPageItems(
  sections: MemberSectionEntry[],
  lang: Lang,
  /** 論文データから自動表示する3種を含めるか(paperAuthor未設定のメンバーは含めない) */
  includePapers = true,
  /** 英語専用の本文(ファイル名 → エントリ)。あるものは日本語の内容の代わりにこちらを使う */
  enSections: Record<string, MemberSectionEnEntry> = {},
): MemberPageItem[] {
  const effectiveGroup = (s: MemberSectionEntry) => (lang === 'en' && s.data.groupEn) ? s.data.groupEn : s.data.group;
  const effectiveOrder = (s: MemberSectionEntry) => (lang === 'en' && s.data.orderEn != null) ? s.data.orderEn : s.data.order;

  const toItem = (s: MemberSectionEntry): MemberPageItem => {
    const key = memberSectionKey(s);
    return {
      key,
      kind: 'section',
      group: effectiveGroup(s),
      label: lang === 'ja' ? s.data.title : s.data.titleEn,
      section: (lang === 'en' && enSections[key]) || s,
    };
  };
  // 英語版がない(enAvailable: false)セクションは英語ページから除外する
  const visible = sections
    .filter((s) => lang === 'ja' || s.data.enAvailable)
    .sort((a, b) => effectiveOrder(a) - effectiveOrder(b));
  return [
    ...visible.filter((s) => effectiveGroup(s) === 'intro').map(toItem),
    ...(includePapers ? paperTypes : []).map((t): MemberPageItem => ({
      key: t, kind: 'papers', group: 'papers', label: paperTypeLabels[t][lang], paperType: t,
    })),
    ...visible.filter((s) => effectiveGroup(s) === 'papers').map(toItem),
    ...visible.filter((s) => effectiveGroup(s) === 'other').map(toItem),
  ];
}
