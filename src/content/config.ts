import { defineCollection, z } from 'astro:content';

const membersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    role: z.string(),
    photo: z.string().optional(),
    email: z.string().optional(),
    research: z.array(z.string()).optional(),
    // 論文データ(papersのauthorsJa)上での表記。指定すると個別ページに業績一覧を表示する
    paperAuthor: z.string().optional(),
    order: z.number().default(999),
  }),
});

const membersEnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    role: z.string(),
    photo: z.string().optional(),
    email: z.string().optional(),
    research: z.array(z.string()).optional(),
    // 論文データ(papersのauthorsJa)上での表記。指定すると個別ページに業績一覧を表示する
    paperAuthor: z.string().optional(),
    order: z.number().default(999),
  }),
});

const memberListCollection = defineCollection({
  type: 'content',
  schema: z.object({
    faculty: z.array(z.object({
      name: z.string(),
      nameEn: z.string().optional(),
      role: z.string(),
      roleEn: z.string(),
      slug: z.string(),
    })),
    students: z.array(z.object({
      section: z.string(),
      sectionEn: z.string(),
      members: z.array(z.object({
        name: z.string(),
        nameEn: z.string().optional(),
        year: z.string(),
      })),
    })),
    alumni: z.array(z.object({
      name: z.string(),
      nameEn: z.string(),
      affiliation: z.string(),
      affiliationEn: z.string(),
      url: z.string(),
    })),
  }),
});

const memberListEnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    faculty: z.array(z.object({
      name: z.string(),
      nameEn: z.string().optional(),
      role: z.string(),
      roleEn: z.string(),
      slug: z.string(),
    })),
    students: z.array(z.object({
      section: z.string(),
      sectionEn: z.string(),
      members: z.array(z.object({
        name: z.string(),
        nameEn: z.string().optional(),
        year: z.string(),
      })),
    })),
    alumni: z.array(z.object({
      name: z.string(),
      nameEn: z.string(),
      affiliation: z.string(),
      affiliationEn: z.string(),
      url: z.string(),
    })),
  }),
});

const paperSchema = z.object({
  // 日本語タイトル・英語タイトルは片方だけの場合がある（片方は表示側でフォールバック）
  titleJa: z.string().optional(),
  titleEn: z.string().optional(),
  authorsJa: z.array(z.string()),
  authorsEn: z.array(z.string()),
  // 発表日 (YYYY-MM-DD)。年度絞り込み・新しい順ソートの両方のキー (yearは冗長なので持たない。paperYear()で導出する)
  date: z.string(),
  type: z.enum(['journal', 'international', 'domestic']),
  venueJa: z.string(),
  venueEn: z.string(),
  place: z.string().optional(),
  url: z.string().optional(),
  doi: z.string().optional(),
  webpage: z.string().optional(),
  publish: z.string().optional(),
  local: z.string().optional(),
}).refine((data) => !!(data.titleJa || data.titleEn), {
  message: 'titleJa または titleEn のいずれかが必要です',
});

const papersCollection = defineCollection({
  type: 'content',
  schema: paperSchema,
});

const awardsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    recipient: z.string(),
    year: z.number(),
    organization: z.string(),
  }),
});

const awardsEnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    recipient: z.string(),
    year: z.number(),
    organization: z.string(),
  }),
});

const researchCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    image: z.string().optional(),
    order: z.number().default(999),
  }),
});

const researchEnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    image: z.string().optional(),
    order: z.number().default(999),
  }),
});

const graduatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
  }),
});

const graduatesEnCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
  }),
});

// メンバー個別ページに追加で表示するセクション(旧サイトの招待論文・特許・学会活動など)
// src/content/member-sections/<メンバーのslug>/xxx.md に置く
// 追加セクションがあるメンバーは、個別ページが目次+履歴になり、各項目は /members/<slug>/<ファイル名>/ の別ページになる
// group: 'intro' は目次の先頭(「研究業績」の前)、'papers' は「研究業績」の中(自動表示の論文3種の後ろ)、'other' はその後ろに並ぶ
const memberSectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    group: z.enum(['intro', 'papers', 'other']),
    order: z.number().default(999),
    // 旧サイトの英語ページに対応する項目がない(=英訳がない)セクションは false にして英語ページから除外する
    enAvailable: z.boolean().default(true),
    // 英語ページでの目次上のグループ・並び順が日本語ページと異なる場合に指定する(旧サイトの英語ページの構成に合わせるため)
    groupEn: z.enum(['intro', 'papers', 'other']).optional(),
    orderEn: z.number().optional(),
  }),
});

// member-sections のうち、日本語の内容をそのまま出すのではなく英語ページ専用の本文を用意したい項目
// (例: 履歴は日本語の学歴・職歴の地の文なので、英語版は独自に書く)
// src/content/member-sections-en/<メンバーのslug>/<同じファイル名>.md に置く。あれば英語ページではこちらを使う
const memberSectionsEnCollection = defineCollection({
  type: 'content',
  schema: z.object({}),
});

export const collections = {
  'member-sections': memberSectionsCollection,
  'member-sections-en': memberSectionsEnCollection,
  'members': membersCollection,
  'members-en': membersEnCollection,
  'memberlist': memberListCollection,
  'memberlist-en': memberListEnCollection,
  'papers': papersCollection,
  'awards': awardsCollection,
  'awards-en': awardsEnCollection,
  'research': researchCollection,
  'research-en': researchEnCollection,
  'graduates': graduatesCollection,
  'graduates-en': graduatesEnCollection,
};
