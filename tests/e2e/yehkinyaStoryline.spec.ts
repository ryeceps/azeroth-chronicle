import { mkdirSync, readFileSync } from 'node:fs';
import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';

const story = JSON.parse(readFileSync('data/stories/yehkinya-and-hakkars-return.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; voiceover: { assetPath: string } }[];
};
mkdirSync('output/yehkinya-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, node: (typeof story.nodes)[number], index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const imageSelector = '.story-atmosphere img, .map-character-figure img, .map-subject-visual img';
  await expect(environment).toHaveAttribute('src', /images\/(storylines|characters)\/yehkinya-hakkar\/.*\.research\.(webp|png)$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Environment image loads for ${node.title}` }).toBe(true);
  await expect.poll(() => page.locator(imageSelector).evaluateAll(elements => elements.every(element => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400;
  })), { message: `Cast and relic images load for ${node.title}` }).toBe(true);
  await expect.poll(() => page.locator('.map-character-figure, .map-subject-visual').evaluateAll(elements => elements.every(element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.top >= 0
      && rect.right <= window.innerWidth && rect.bottom <= window.innerHeight;
  })), { message: `Cast and relic figures fit the ${profile} viewport for ${node.title}` }).toBe(true);

  if (visualReviewEnabled) {
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await captureVisualReview(page, {
      path: `output/yehkinya-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${node.id}.png`,
      fullPage: false,
    });
  }
}

async function traverseAllNodes(page: Page, profile: 'desktop' | 'phone') {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (profile === 'phone') await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=yehkinya-and-hakkars-return');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED CLASSIC STORY THEATER');
    await expect(page.locator('audio')).toHaveAttribute('src', '/' + node.voiceover.assetPath);
    await expectIllustratedScene(page, node, index, profile);
    if (node.id.endsWith('jindos-summoning')) {
      await expect(page.locator('.story-atmosphere img')).toHaveAttribute('src', /zulgurub-summoning-with-cast\.research\.png$/);
      await expect(page.locator('.map-character-figure img[src*="avatar-of-hakkar.research.webp"]')).toHaveCount(0);
    }
    if (node.id.endsWith('hakkar-banished')) {
      await expect(page.locator('.map-character-figure img[src*="hakkar-soulflayer.research.webp"]')).toHaveCount(0);
      await expect(page.getByLabel('Chapter transcript')).toContainText('banished to the plane from which he came');
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
}

test('Yeh’kinya and Hakkar traverses all seventeen illustrated scenes on desktop', async ({ page }) => {
  test.setTimeout(300_000);
  expect(story.guide.nodeIds).toHaveLength(17);
  expect(story.nodes).toHaveLength(17);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await traverseAllNodes(page, 'desktop');
  expect(pageErrors).toEqual([]);
});

test('Yeh’kinya and Hakkar keeps every scene visible at phone width', async ({ page }) => {
  test.setTimeout(300_000);
  await traverseAllNodes(page, 'phone');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
