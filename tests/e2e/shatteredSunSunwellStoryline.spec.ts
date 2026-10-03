import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/shattered-sun-and-sunwell.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds?: string[] }[];
};

mkdirSync('output/shattered-sun-sunwell-visual-review', { recursive: true });

test('The Shattered Sun and Sunwell traverses its cited, illustrated campaign scenes', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(21);
  expect(story.nodes).toHaveLength(21);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/shattered-sun-and-sunwell');
  await expect(page.getByRole('heading', { level: 1, name: 'The Shattered Sun and the restored Sunwell' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=shattered-sun-and-sunwell/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    const environment = page.locator('.story-atmosphere img');
    await expect(environment).toHaveAttribute('src', /.(?:webp|png)$/);
    await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
      image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
    { message: `Environment art loads for ${node.title}` }).toBe(true);
    const figures = page.locator('.map-character-figure img, .map-subject-visual img');
    await expect(figures).toHaveCount(node.entityIds?.length ?? 0);
    await expect.poll(() => figures.evaluateAll((elements) => elements.every((element) => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400;
    })), { message: `All cast and object art loads for ${node.title}` }).toBe(true);
    if (index === 2) {
      await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/desktop-silvermoon-return.png', fullPage: true });
    }
    if (index === 12) {
      await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/desktop-madrigosa-and-brutallus.png', fullPage: true });
    }
    if (index === story.nodes.length - 1) {
      await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/desktop-sunwell-renewed.png', fullPage: true });
    } else {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
  }

  expect(pageErrors).toEqual([]);
});

test('the Sunwell story marker and opening chapter fit touch playback', async ({ page }) => {
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tours/classic-to-wrath');
  const marker = page.getByRole('button', { name: /shattered-sun-and-sunwell|Shattered Sun and the restored Sunwell/i });
  await expect(marker).toBeVisible();
  await marker.click();
  const card = page.locator('.story-tour-touch-card');
  await expect(card.getByRole('heading', { name: 'The Shattered Sun and the restored Sunwell' })).toBeVisible();
  await expect(card).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/phone-story-tour-map.png', fullPage: true });
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A fount for a new home', exact: true })).toBeVisible();
  const environment = page.locator('.story-atmosphere img');
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/phone-opening-scene.png', fullPage: true });
});
