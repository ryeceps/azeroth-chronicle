import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/consortium-and-arcatraz.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};

mkdirSync('output/consortium-and-arcatraz-visual-review', { recursive: true });

test('Consortium and Arcatraz follows its source trail through all illustrated scenes', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(15);
  expect(story.nodes).toHaveLength(15);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/consortium-and-arcatraz');
  await expect(page.getByRole('heading', { level: 1, name: 'The Consortium and the Arcatraz prison' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=consortium-and-arcatraz/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    const environment = page.locator('.story-atmosphere img');
    await expect(environment).toHaveAttribute('src', /\.(?:webp|png)$/);
    await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
      image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
    { message: `Environment art loads for ${node.title}` }).toBe(true);
    const figures = page.locator('.map-character-figure img, .map-subject-visual img');
    await expect(figures).toHaveCount(node.entityIds.length);
    await expect.poll(() => figures.evaluateAll((elements) => elements.every((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400;
    })), { message: `All cast and object art loads for ${node.title}` }).toBe(true);
    if (index === 7) {
      await captureVisualReview(page, { path: 'output/consortium-and-arcatraz-visual-review/desktop-spirits-song.png', fullPage: true });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await captureVisualReview(page, { path: 'output/consortium-and-arcatraz-visual-review/desktop-skyriss-ending.png', fullPage: true });
  expect(pageErrors).toEqual([]);
});

test('Consortium and Arcatraz remains usable at phone width and in its StoryTour marker', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => query === '(pointer: coarse)'
      ? ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList)
      : nativeMatchMedia(query);
  });
  await page.goto('/tours/classic-to-wrath');
  const marker = page.getByRole('button', { name: /consortium-and-arcatraz|Consortium and the Arcatraz/i });
  await expect(marker).toBeVisible();
  await marker.click();
  const card = page.locator('.story-tour-touch-card');
  await expect(card.getByRole('heading', { name: 'The Consortium and the Arcatraz prison' })).toBeVisible();
  await expect(card).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/consortium-and-arcatraz-visual-review/phone-story-map.png', fullPage: true });
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The crystal that is not the answer', exact: true })).toBeVisible();
  await expect(page.locator('.story-atmosphere img')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: 'output/consortium-and-arcatraz-visual-review/phone-opening-scene.png', fullPage: true });
});
