// Small facts derived from a case study's Markdown, shown on cards and page headers.

export function readingMinutes(body = ''): number {
  const prose = body.replace(/<[^>]+>|\{[\s\S]*?\}|import .*\n/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function storyCount(body = ''): number {
  const section = body.split(/^## Production stor[^\n]*\n/m)[1];
  if (!section) return 0;
  return (section.split(/^## /m)[0].match(/^### /gm) ?? []).length;
}
