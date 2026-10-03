import { captureVisualReview } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/scythe-of-elune-original-mystery.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};
const screenshotRoot = 'output/scythe-of-elune-visual-review';
mkdirSync(screenshotRoot, { recursive: true });
const screenshotNodes = new Set([0, 7, 11, 14]);

async function expectIllustratedScene(page: Page, index: number, profile: 'desktop' | 'phone') {
  const node = story.nodes[index]!;
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');

  await expect(environment).toHaveAttribute('src', /images\/storylines\/scythe-of-elune\/environments\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Classic-area environment loads for ${node.title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment, cast and object art loads for ${node.title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
  await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED CLASSIC STORY THEATER');

  if (screenshotNodes.has(index)) {
    await captureVisualReview(page, {
      path: `${screenshotRoot}/${profile}-${String(index + 1).padStart(2, '0')}-${node.id}.png`,
    });
  }
}

test('Scythe story placard opens from its Classic-to-Wrath map position', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/tours/classic-to-wrath');
  const marker = page.getByRole('button', { name: /scythe of elune: the original mystery/i });
  await expect(marker).toBeVisible();
  await marker.hover();
  const card = page.locator('#story-tour-tip-scythe-of-elune-original-mystery');
  await expect(card.getByRole('heading', { name: 'The Scythe of Elune: The Original Mystery' })).toBeVisible();
  await expect(card).toContainText('Playable story');
  await captureVisualReview(page, { path: `${screenshotRoot}/story-tour-map-desktop.png` });
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'scythe-of-elune-original-mystery', 'story']);
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
});

test('Scythe story traverses every cited scene at desktop width', async ({ page }) => {
  test.setTimeout(360_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(15);
  expect(story.nodes).toHaveLength(15);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/scythe-of-elune-original-mystery');
  await expect(page.getByRole('heading', { level: 1, name: 'The Scythe of Elune: The Original Mystery' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=scythe-of-elune-original-mystery/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(pageErrors).toEqual([]);
  await captureVisualReview(page, { path: `${screenshotRoot}/desktop-final.png` });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/scythe-of-elune-original-mystery$/);
});

test('Scythe scenes remain usable and illustrated at phone width', async ({ page }) => {
  test.setTimeout(360_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=scythe-of-elune-original-mystery');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: `${screenshotRoot}/phone-final.png` });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/scythe-of-elune-original-mystery$/);
});
