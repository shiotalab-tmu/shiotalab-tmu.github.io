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

const papersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    type: z.enum(['journal', 'international', 'domestic']),
    venue: z.string(),
    url: z.string().optional(),
  }),
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

const graduatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
  }),
});

export const collections = {
  'members': membersCollection,
  'memberlist': memberListCollection,
  'papers': papersCollection,
  'awards': awardsCollection,
  'research': researchCollection,
  'graduates': graduatesCollection,
};