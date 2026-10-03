import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/stormwind-onyxia-conspiracy.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; eventIds: string[] }[];
};

async function expectIllustratedScene(page: Page, title: string, index: number, profile: string) {
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(page.locator('.story-atmosphere img')).toHaveAttribute('src', /onyxia\/.*\.research\.webp$/);
  await expect.poll(() => images.evaluateAll(elements => elements.every(element => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment and cast images load in ${title}` }).toBe(true);
  if (visualReviewEnabled) {
    await captureVisualReview(page, { path: `output/onyxia-visual-review/${profile}-${String(index + 1).padStart(2, '0')}.png` });
  }
}

test('Onyxia storyline traverses every cited scene and returns to its reading page', async ({ page }) => {
  test.setTimeout(120_000);
  expect(story.guide.nodeIds).toHaveLength(21);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/stormwind-onyxia-conspiracy');
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=stormwind-onyxia-conspiracy/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if ([1, 7, 16, 20].includes(index)) {
      await captureVisualReview(page, { path: `output/onyxia-visual-review/desktop-${node.id}.png` });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/stormwind-onyxia-conspiracy$/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Dragon in Stormwind' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Leave tour' })).toHaveCount(0);
});

test('Onyxia direct playback fits phone scenes and keeps faction casts distinct', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=stormwind-onyxia-conspiracy');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();
  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if ([1, 7, 16, 20].includes(index)) {
      await captureVisualReview(page, { path: `output/onyxia-visual-review/phone-${node.id}.png` });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: 'output/onyxia-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/stormwind-onyxia-conspiracy$/);
});
