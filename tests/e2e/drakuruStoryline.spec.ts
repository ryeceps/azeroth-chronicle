import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/drakuru-betrayal.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};

mkdirSync('output/drakuru-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, index: number, profile: 'desktop' | 'phone') {
  const node = story.nodes[index]!;
  const environment = page.locator('.story-atmosphere img');
  const figures = page.locator('.map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/drakuru-betrayal\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Area illustration loads for ${node.title}` }).toBe(true);
  await expect.poll(() => figures.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && image.currentSrc.endsWith('.webp');
  })), { message: `Contextual cast and prop art loads for ${node.title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);

  if (visualReviewEnabled) {
    await captureVisualReview(page, {
      path: `output/drakuru-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${node.id}.png`,
    });
  }
}

test('Drakuru story traverses every sourced scene with its named character and prop art', async ({ page }) => {
  test.setTimeout(300_000);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(20);
  expect(story.nodes).toHaveLength(20);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/drakuru-betrayal');
  await expect(page.getByRole('heading', { level: 1, name: 'Drakuru: Trust, Betrayal, and Infiltration' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=drakuru-betrayal/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    await expectIllustratedScene(page, index, 'desktop');

    if (node.id.endsWith('eye-of-the-prophets')) {
      await expect(page.locator('.map-subject-visual img[src*="eye-of-the-prophets.research.webp"]')).toBeVisible();
      await expect(page.locator('.map-character-figure img[src*="warlord-zimbo.research.webp"]')).toBeVisible();
    }
    if (node.id.endsWith('the-lich-kings-gift')) {
      await expect(page.locator('.map-character-figure img[src*="drakuru-empowered.research.webp"]')).toBeVisible();
      await expect(page.locator('.map-character-figure img[src*="lich-king-arthas.research.webp"]')).toBeVisible();
    }
    if (node.id.endsWith('the-scepter-of-domination')) {
      await expect(page.locator('.map-subject-visual img[src*="scepter-of-domination.research.webp"]')).toBeVisible();
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await captureVisualReview(page, { path: 'output/drakuru-visual-review/desktop-final.png' });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/drakuru-betrayal$/);
  expect(pageErrors).toEqual([]);
});

test('Drakuru theater remains readable and illustrated at phone width', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=drakuru-betrayal');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: 'output/drakuru-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/drakuru-betrayal$/);
});

test('Drakuru is a playable Northrend placard in the Classic-to-Wrath map', async ({ page }) => {
  await page.goto('/tours/classic-to-wrath');
  await expect(page.locator('.story-tour-dot')).toHaveCount(24);
  const drakuru = page.getByRole('button', { name: /Drakuru: Trust, Betrayal, and Infiltration/i });
  await expect(drakuru).toBeVisible();
  await drakuru.hover();
  const card = page.locator('#story-tour-tip-drakuru-betrayal');
  await expect(card.getByRole('heading', { name: 'Drakuru: Trust, Betrayal, and Infiltration' })).toBeVisible();
  await expect(card).toContainText('Playable story');
  if (visualReviewEnabled) await captureVisualReview(page, { path: 'output/drakuru-visual-review/classic-wrath-map.png', fullPage: true });
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'drakuru-betrayal', 'story']);
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
});
