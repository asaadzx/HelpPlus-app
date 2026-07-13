import { FeedItem } from '../types';

const MAX_ITEMS_PER_FEED = 10;

export function parseRSS(xml: string, feedTitle: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const item of itemMatches.slice(0, MAX_ITEMS_PER_FEED)) {
    const title = extractTag(item, 'title') || '';
    const description = stripHtml(extractTag(item, 'description') || '').slice(0, 200);
    const link = extractTag(item, 'link') || '';
    const pubDate = extractTag(item, 'pubDate') || '';

    if (title) {
      items.push({
        id: `${feedTitle}-${items.length}`,
        title,
        description,
        link,
        pubDate,
        feedTitle,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | undefined {
  const cdataPattern = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`);
  const plainPattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);

  return (xml.match(cdataPattern) || xml.match(plainPattern))?.[1]?.trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
