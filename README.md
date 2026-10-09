# Zeeshan Imdad — Portfolio

Source for **https://xeeshan16.github.io**: case studies in backend systems for payments, event streaming and agentic AI, each with a high-level architecture diagram, production stories and the decisions behind them.

Built with [Astro](https://astro.build) and MDX. It's fully static: no backend, no database, no client-side framework. Diagrams are rendered to inline SVG at build time from plain data, so they follow the light and dark themes and stay sharp at any size.

## Run it locally

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev       # http://localhost:4321, reloads as you edit
npm run build     # type-checks, then builds to dist/
npm run preview   # serves dist/
```

## How it's organised

| What | Where |
| --- | --- |
| Profile, headline numbers, experience, skills, certifications | `src/data/profile.ts` |
| Case studies (one page each, Markdown or MDX) | `src/content/work/` |
| Architecture and state diagrams (as data) | `src/data/architecture.ts` |
| Diagram renderers | `src/components/ArchitectureDiagram.astro`, `src/components/SequenceDiagram.astro` |
| Design tokens: colours, type, spacing | `src/styles/global.css` |
| Site address | `astro.config.mjs` (`SITE_URL`) and `public/robots.txt` |

A case study is a file in `src/content/work/`; its front matter (title, metrics, stack, role) is validated by the schema in `src/content.config.ts`. Use `.mdx` when the write-up needs a diagram inline. `featured: true` puts it in the large cards on the home page, and `draft: true` hides it.

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, **Pages → Source** must be set to **GitHub Actions**.

To move to a custom domain later: add it under **Settings → Pages → Custom domain**, then update `SITE_URL` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
