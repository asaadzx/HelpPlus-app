import { parseRSS } from '../rss';

function wrapItems(items: string): string {
  return `<rss><channel><title>Test Feed</title>${items}</channel></rss>`;
}

function makeItem(fields: {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
}): string {
  const parts: string[] = [];
  if (fields.title !== undefined) parts.push(`<title>${fields.title}</title>`);
  if (fields.description !== undefined)
    parts.push(`<description>${fields.description}</description>`);
  if (fields.link !== undefined) parts.push(`<link>${fields.link}</link>`);
  if (fields.pubDate !== undefined) parts.push(`<pubDate>${fields.pubDate}</pubDate>`);
  return `<item>${parts.join('')}</item>`;
}

describe('parseRSS', () => {
  const feedTitle = 'My Test Feed';

  it('parses valid RSS with multiple items', () => {
    const xml = wrapItems(
      makeItem({ title: 'First', description: 'Desc 1', link: 'https://a.com', pubDate: 'Mon, 01 Jan 2024' }) +
        makeItem({ title: 'Second', description: 'Desc 2', link: 'https://b.com', pubDate: 'Tue, 02 Jan 2024' })
    );

    const items = parseRSS(xml, feedTitle);

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      id: 'My Test Feed-0',
      title: 'First',
      description: 'Desc 1',
      link: 'https://a.com',
      pubDate: 'Mon, 01 Jan 2024',
      feedTitle,
    });
    expect(items[1].title).toBe('Second');
    expect(items[1].id).toBe('My Test Feed-1');
  });

  it('handles missing optional fields (pubDate, description)', () => {
    const xml = wrapItems(makeItem({ title: 'No Optionals', link: 'https://c.com' }));

    const items = parseRSS(xml, feedTitle);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('No Optionals');
    expect(items[0].link).toBe('https://c.com');
    expect(items[0].description).toBe('');
    expect(items[0].pubDate).toBe('');
  });

  it('returns empty array for RSS with no items', () => {
    const xml = wrapItems('');

    expect(parseRSS(xml, feedTitle)).toEqual([]);
  });

  it('returns empty array for malformed XML', () => {
    expect(parseRSS('this is not xml', feedTitle)).toEqual([]);
    expect(parseRSS('', feedTitle)).toEqual([]);
    expect(parseRSS('<rss><channel></channel></rss>', feedTitle)).toEqual([]);
  });

  it('skips items without a title', () => {
    const xml = wrapItems(
      makeItem({ description: 'no title here', link: 'https://d.com' }) +
        makeItem({ title: 'Valid', link: 'https://e.com' })
    );

    const items = parseRSS(xml, feedTitle);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Valid');
  });

  it('handles CDATA content', () => {
    const xml = wrapItems(
      '<item>' +
        '<title><![CDATA[CDATA Title]]></title>' +
        '<description><![CDATA[<p>HTML in <b>CDATA</b></p>]]></description>' +
        '<link>https://f.com</link>' +
        '<pubDate>Wed, 03 Jan 2024</pubDate>' +
        '</item>'
    );

    const items = parseRSS(xml, feedTitle);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('CDATA Title');
    expect(items[0].description).toBe('HTML in CDATA');
    expect(items[0].link).toBe('https://f.com');
  });

  it('strips HTML from descriptions', () => {
    const xml = wrapItems(
      makeItem({ title: 'HTML Desc', description: '<p>Hello <a href="#">world</a></p>' })
    );

    const items = parseRSS(xml, feedTitle);

    expect(items[0].description).toBe('Hello world');
  });

  it('truncates description to 200 characters', () => {
    const longDesc = 'A'.repeat(300);
    const xml = wrapItems(makeItem({ title: 'Long', description: longDesc }));

    const items = parseRSS(xml, feedTitle);

    expect(items[0].description).toHaveLength(200);
  });

  it('respects MAX_ITEMS_PER_FEED limit of 10', () => {
    const manyItems = Array.from({ length: 15 }, (_, i) =>
      makeItem({ title: `Item ${i}` })
    ).join('');

    const items = parseRSS(wrapItems(manyItems), feedTitle);

    expect(items).toHaveLength(10);
    expect(items[9].title).toBe('Item 9');
  });

  it('generates correct id and feedTitle', () => {
    const xml = wrapItems(makeItem({ title: 'Test' }));
    const items = parseRSS(xml, 'Custom Feed');

    expect(items[0].id).toBe('Custom Feed-0');
    expect(items[0].feedTitle).toBe('Custom Feed');
  });
});
