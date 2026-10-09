// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Where the site is served (used for canonical URLs, sitemap and social cards). Change it if you move to a custom domain.
export const SITE_URL = 'https://xeeshan16.github.io';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap(), mdx()],
  build: { format: 'directory' },
});
