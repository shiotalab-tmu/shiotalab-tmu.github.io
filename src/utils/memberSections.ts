import { getCollection, type CollectionEntry } from 'astro:content';

export type MemberSectionEntry = CollectionEntry<'member-sections'>;
export type PaperType = 'journal' | 'international' | 'domestic';
type Lang = 'ja' | 'en';

/** 指定メンバーの追加セクションを order 順で取得する(slugは "kiya-hitoshi/invited" のような形) */
export async function getMemberSections(memberSlug: string): Promise<MemberSectionEntry[]> {
  const all = await getCollection('member-sections');
  return all
    .filter((s) => s.slug.startsWith(`${memberSlug}/`))
    .sort((a, b) => a.data.order - b.data.order);
}

/** セクションのURL上の名前(ファイル名)。例: "invited" */
export function memberSectionKey(section: MemberSectionEntry): string {
  return section.slug.split('/').pop()!;
}

// 旧サイト(www-isys.sd.tmu.ac.jp/kiya/)に合わせた論文種別の名前
export const paperTypeLabels: Record<PaperType, Record<Lang, string>> = {
  journal: { ja: '学術論文', en: 'Journal Papers' },
  international: { ja: '国際会議論文', en: 'International Conference Papers' },
  domestic: { ja: '学会講演論文', en: 'Domestic Conference Papers' },
};
const paperTypes: PaperType[] = ['journal', 'international', 'domestic'];

/** 個別ページ1つ分の情報 */
export type MemberPageItem =
  | { key: PaperType; kind: 'papers'; group: 'papers'; label: string; paperType: PaperType }
  | { key: string; kind: 'section'; group: 'intro' | 'papers' | 'other'; label: string; section: MemberSectionEntry };

/**
 * 目次に並ぶ個別ページの一覧(表示順)。
 * group:'intro'(履歴など) → 研究業績[論文3種(自動) → group:'papers'] → group:'other'
 */
export function memberPageItems(
  sections: MemberSectionEntry[],
  lang: Lang,
  /** 論文データから自動表示する3種を含めるか(paperAuthor未設定のメンバーは含めない) */
  includePapers = true,
): MemberPageItem[] {
  const toItem = (s: MemberSectionEntry): MemberPageItem => ({
    key: memberSectionKey(s),
    kind: 'section',
    group: s.data.group,
    label: lang === 'ja' ? s.data.title : s.data.titleEn,
    section: s,
  });
  return [
    ...sections.filter((s) => s.data.group === 'intro').map(toItem),
    ...(includePapers ? paperTypes : []).map((t): MemberPageItem => ({
      key: t, kind: 'papers', group: 'papers', label: paperTypeLabels[t][lang], paperType: t,
    })),
    ...sections.filter((s) => s.data.group === 'papers').map(toItem),
    ...sections.filter((s) => s.data.group === 'other').map(toItem),
  ];
}
