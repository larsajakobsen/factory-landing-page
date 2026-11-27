import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const indexHtml = readFileSync(join(rootDir, 'index.html'), 'utf-8');
const aboutPath = join(rootDir, 'om-nova-consulting-group.html');
const html = readFileSync(aboutPath, 'utf-8');
const notFoundPath = join(rootDir, '404.html');
const notFoundHtml = readFileSync(notFoundPath, 'utf-8');

describe('Om Nova Consulting Group page', () => {
  test('menu target file exists', () => {
    const navMatch = indexHtml.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
    assert.ok(navMatch, 'main menu found in index.html');
    const linkMatch = navMatch[0].match(/<a[^>]*href="([^"]+)"[^>]*>Om Nova Consulting Group<\/a>/);
    assert.ok(linkMatch, 'link to Om Nova Consulting Group found');
    assert.ok(existsSync(join(rootDir, linkMatch[1])), 'linked file exists on disk');
  });

  test('title and heading are Om Nova Consulting Group', () => {
    assert.match(html, /<title>Om Nova Consulting Group<\/title>/);
    assert.match(html, /<h1[^>]*>Om Nova Consulting Group<\/h1>/);
  });

  test('page has the same main menu', () => {
    const navMatch = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
    assert.ok(navMatch, 'main menu found');
    assert.match(navMatch[0], /<a[^>]*href="om-nova-consulting-group\.html"[^>]*aria-current="page"[^>]*>Om Nova Consulting Group<\/a>/);
  });

  test('is public and ungated', () => {
    assert.doesNotMatch(html, /hidden/);
    assert.doesNotMatch(html, /display:\s*none/);
    assert.doesNotMatch(html, /visibility:\s*hidden/);
    assert.doesNotMatch(html, /<details/);
    assert.doesNotMatch(html, /login/i);
    assert.doesNotMatch(html, /password/i);
    assert.doesNotMatch(html, /<script/);
    assert.doesNotMatch(html, /<form/);
    assert.doesNotMatch(html, /https?:\/\/[^\s"'>]+/);
  });

  test('states that Nova Consulting Group supplies the factory', () => {
    assert.match(html, /Nova Consulting Group leverer fabrikken/);
  });

  test('shows the English company description verbatim', () => {
    const langEnIndex = html.search(/lang="en"/);
    assert.ok(langEnIndex >= 0, 'lang="en" attribute found');

    const paragraphs = [
      'Excellence is our foundation. We recruit top talent and champion continuous growth, facilitate collaboration and build a whole stronger than the sum of its parts.',
      'By staying humble, focused, and pragmatic, we make digital excellence easy and build lasting client partnerships.',
      'NOVA Consulting Group is a Scandinavian collective of specialized agencies dedicated to helping clients thrive in the digital era. Since launching our first agency, Epinova, in 2007, we\'ve stayed true to our founders’ vision: build the company we’d want to work for—putting people first, fostering deep expertise, and encouraging an entrepreneurial spirit. At NOVA, innovation is driven by experts in focused teams, not massive generalists, and employee co-ownership ensures our people are invested and bring their best ideas.',
    ];
    for (const paragraph of paragraphs) {
      const paragraphIndex = html.indexOf(paragraph);
      assert.ok(paragraphIndex >= 0, `missing verbatim paragraph: ${paragraph.slice(0, 40)}...`);
      assert.ok(paragraphIndex > langEnIndex, `paragraph is not inside the lang="en" block: ${paragraph.slice(0, 40)}...`);
    }
    assert.match(html, /<h2[^>]*>Who we are<\/h2>/);
  });

  test('the "we\'ve" apostrophe is straight, the others are curly', () => {
    assert.ok(html.includes('we\'ve stayed'), 'we\'ve uses a straight apostrophe');
    assert.ok(html.includes('founders’ vision'), 'founders’ uses a curly apostrophe');
    assert.ok(html.includes('we’d want'), 'we’d uses a curly apostrophe');
    assert.ok(html.includes('work for—putting'), 'uses an em dash before putting');
  });

  test('shows three key figures with English labels', () => {
    const dlMatch = html.match(/<dl[^>]*>[\s\S]*?<\/dl>/);
    assert.ok(dlMatch, 'key figures list found');
    const dl = dlMatch[0];
    const dtCount = (dl.match(/<dt/g) || []).length;
    assert.equal(dtCount, 3);
    assert.match(dl, /Experts/i);
    assert.match(dl, /Specialized agencies/i);
    assert.match(dl, /Annual revenue/i);
    assert.match(dl, /600\+/);
    assert.match(dl, />10</);
    assert.match(dl, /950MNOK/);
  });

  test('is mobile-ready', () => {
    assert.match(html, /name="viewport"\s+content="width=device-width,\s*initial-scale=1"/);
    assert.doesNotMatch(html, /width:\s*\d{4,}px/);
    assert.doesNotMatch(html, /100vw/);
  });

  test('404 page explains the error and links home', () => {
    assert.ok(existsSync(notFoundPath), '404.html exists');
    assert.match(notFoundHtml, /<h1[^>]*>Siden kunne ikke åpnes<\/h1>/);
    assert.match(notFoundHtml, /<a[^>]*href="(index\.html|\.\/|\/)"[^>]*>Tilbake til forsiden<\/a>/);
  });
});
