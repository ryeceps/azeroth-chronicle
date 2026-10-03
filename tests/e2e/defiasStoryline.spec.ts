import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/defias-original-conspiracy.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; eventIds: string[] }[];
};

mkdirSync('output/defias-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, index: number, profile: 'desktop' | 'phone') {
  const node = story.nodes[index]!;
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');

  await expect(environment).toHaveAttribute('src', /\/images\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Environment image loads for ${node.title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment, cast and object images load for ${node.title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual'))
    .toHaveCount(node.entityIds.length);

  if (visualReviewEnabled) {
    await captureVisualReview(page, {
      path: `output/defias-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${node.id}.png`,
    });
  }
}

test('Defias traverses all cited scenes and returns to its text-first story page', async ({ page }) => {
  test.setTimeout(360_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(21);
  expect(story.nodes).toHaveLength(21);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/defias-original-conspiracy');
  await expect(page.getByRole('heading', { level: 1, name: 'The Defias and the Unsent Letter' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=defias-original-conspiracy/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await captureVisualReview(page, { path: 'output/defias-visual-review/desktop-final.png' });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/defias-original-conspiracy$/);
  expect(pageErrors).toEqual([]);
});

test('Defias keeps every illustrated scene visible at phone width', async ({ page }) => {
  test.setTimeout(360_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=defias-original-conspiracy');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: 'output/defias-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/defias-original-conspiracy$/);
});
