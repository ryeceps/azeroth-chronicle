import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/wrathgate-and-undercity.research.json', 'utf8')) as {
  guide: { id: string; nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds?: string[]; eventIds?: string[]; visualActions?: { mapStateId?: string }[] }[];
};
const orderedNodes = story.guide.nodeIds.map((id) => {
  const node = story.nodes.find((candidate) => candidate.id === id);
  if (!node) throw new Error('Missing story node ' + id);
  return node;
});
mkdirSync('output/wrathgate-visual-review/desktop', { recursive: true });
mkdirSync('output/wrathgate-visual-review/phone', { recursive: true });

async function expectScene(page: Page, node: (typeof orderedNodes)[number], profile: 'desktop' | 'phone', index: number) {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/wrathgate-and-undercity\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: 'Wrath-era environment art loads for ' + node.title }).toBe(true);
  const standaloneFigureCount = (node.entityIds ?? []).filter((entityId) => entityId !== 'red-dragonflight-wrathgate').length;
  await expect(page.locator('.map-character-figure img, .map-subject-visual img')).toHaveCount(standaloneFigureCount);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: 'Environment and principal cast art load for ' + node.title }).toBe(true);
  if (visualReviewEnabled) {
    const sequence = String(index + 1).padStart(2, '0');
    await captureVisualReview(page, {
      path: 'output/wrathgate-visual-review/' + profile + '/' + sequence + '-' + node.id + '.png',
      fullPage: true,
      animations: 'disabled',
    });
  }
}

test('Wrathgate and Undercity traverses all sourced scenes on desktop and returns to its story page', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(19);
  expect(story.nodes).toHaveLength(19);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/wrathgate-and-undercity');
  await expect(page.getByRole('heading', { level: 1, name: 'The Wrathgate and Undercity' })).toBeVisible();
  await expect(page.locator('.storyline-page-header .eyebrow')).toContainText('research story');
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=wrathgate-and-undercity/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of orderedNodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    await expectScene(page, node, 'desktop', index);
    if (index < orderedNodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  expect(pageErrors).toEqual([]);
  await captureVisualReview(page, { path: 'output/wrathgate-visual-review/desktop-final.png', fullPage: true });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/wrathgate-and-undercity$/);
});

test('Wrathgate and Undercity keeps each scene legible at phone width', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=wrathgate-and-undercity&node=' + orderedNodes[0]!.id + '&play=story');
  await expect(page.getByRole('heading', { name: orderedNodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of orderedNodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectScene(page, node, 'phone', index);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    if (index < orderedNodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await captureVisualReview(page, { path: 'output/wrathgate-visual-review/phone-final.png', fullPage: true });
});
