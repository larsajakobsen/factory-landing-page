import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '..', 'index.html');
const html = readFileSync(indexPath, 'utf-8');

describe('Agent Factory landing page', () => {
  test('serves a single static HTML document at the root', () => {
    assert.match(html, /^<!doctype html>/i);
    assert.doesNotMatch(html, /<script/);
    assert.doesNotMatch(html, /<form/);
    assert.doesNotMatch(html, /<iframe/);
  });

  test('contains every required section', () => {
    const sections = ['description', 'how-it-works', 'what-makes-it-ours', 'what-you-see', 'where-it-runs', 'mvp-timeline'];
    for (const section of sections) {
      assert.match(html, new RegExp(`<section[^>]*id="?${section}"?[^>]*>`));
    }
  });

  test('section headings match supplied content', () => {
    assert.match(html, /How it works/);
    assert.match(html, /What makes it ours/);
    assert.match(html, /What you see/);
    assert.match(html, /Where it runs/);
    assert.match(html, /MVP/i);
  });

  test('how it works lists a 7-step pipeline', () => {
    const howItWorksMatch = html.match(/<section[^>]*id="?how-it-works"?[^>]*>[\s\S]*?<\/section>/);
    assert.ok(howItWorksMatch, 'how-it-works section found');
    const liCount = (howItWorksMatch[0].match(/<li/g) || []).length;
    assert.equal(liCount, 7);
  });

  test('key content facts are present', () => {
    const facts = [
      'GitHub issues', 'pull requests',
      /versioned factory policy/i, 'Project profile', 'Oslo Live',
      'Control UI', 'Cost per merged PR',
      'isolated', 'Azure', 'customer-hosted',
      '7 weeks', 'Chat-based intake', 'Azure DevOps'
    ];
    for (const fact of facts) {
      assert.match(html, fact instanceof RegExp ? fact : new RegExp(fact));
    }
  });

  test('has Get in touch CTAs near top and bottom', () => {
    const ctaMatches = [...html.matchAll(/<a[^>]*>Get in touch<\/a>/g)];
    assert.ok(ctaMatches.length >= 2);
    assert.ok(/id="?cta-top"?/.test(html));
    assert.ok(/id="?cta-bottom"?/.test(html));
    const headerMatch = html.match(/<header[^>]*>[\s\S]*?<\/header>/);
    const footerMatch = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
    assert.ok(headerMatch && /Get in touch/.test(headerMatch[0]));
    assert.ok(footerMatch && /Get in touch/.test(footerMatch[0]));
  });

  test('every Get in touch CTA mails cto@novanet.no', () => {
    const ctaMatches = [...html.matchAll(/<a[^>]*href="?([^"]*)"?[^>]*>Get in touch<\/a>/g)];
    assert.ok(ctaMatches.length >= 2);
    for (const [, href] of ctaMatches) {
      assert.match(href, /^mailto:cto@novanet\.no(\?.*)?$/);
    }
  });

  test('no gated or hidden content', () => {
    assert.doesNotMatch(html, /hidden/);
    assert.doesNotMatch(html, /display:\s*none/);
    assert.doesNotMatch(html, /visibility:\s*hidden/);
    assert.doesNotMatch(html, /<details/);
    assert.doesNotMatch(html, /login/i);
    assert.doesNotMatch(html, /password/i);
  });

  test('is mobile-ready', () => {
    assert.match(html, /name="viewport"\s+content="width=device-width,\s*initial-scale=1"/);
    assert.doesNotMatch(html, /width:\s*\d{4,}px/);
    assert.doesNotMatch(html, /100vw/);
  });

  test('has no tracking or external resources', () => {
    assert.doesNotMatch(html, /https?:\/\/[^\s"'>]+/);
    assert.doesNotMatch(html, /google-analytics/i);
    assert.doesNotMatch(html, /gtag/i);
    assert.doesNotMatch(html, /plausible/i);
  });
});
