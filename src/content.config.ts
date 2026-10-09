import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each Markdown (.md) or MDX (.mdx) file in src/content/work/ becomes a case study at /work/<file-name>/.
// Use .mdx when the write-up needs a component inline, such as a sequence diagram.
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    area: z.string(),
    summary: z.string(),
    // One-line result shown in the home page's "More work" list when there is no headline metric.
    highlight: z.string().optional(),
    order: z.number(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    stack: z.array(z.string()),
    role: z
      .object({ title: z.string(), period: z.string().optional(), team: z.string().optional(), scope: z.string() })
      .optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };
