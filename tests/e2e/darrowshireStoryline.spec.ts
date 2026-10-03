import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/darrowshire-lost-and-remembered.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};

mkdirSync('output/darrowshire-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, title: string, index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/darrowshire\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 700 && image.naturalHeight >= 400),
  { message: `Classic Plaguelands environment loads for ${title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
      && image.currentSrc.endsWith('.research.webp');
  })), { message: `Environment, cast and object art loads for ${title}` }).toBe(true);
  const stageFigures = page.locator('.map-character-figure, .map-subject-visual');
  await expect(stageFigures).toHaveCount(story.nodes[index]!.entityIds.length);
  await expect.poll(() => stageFigures.evaluateAll((elements) => {
    const viewport = document.querySelector('.map-viewport')?.getBoundingClientRect();
    if (!viewport) return false;
    return elements.every((element) => {
      const rect = element.getBoundingClientRect();
      const intersectionWidth = Math.max(0, Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left));
      const intersectionHeight = Math.max(0, Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top));
      return rect.width > 0 && rect.height > 0 && (intersectionWidth * intersectionHeight) / (rect.width * rect.height) >= 0.8;
    });
  }), { message: `Every story actor and object remains in the visible map frame for ${title}` }).toBe(true);

  if (visualReviewEnabled && [0, 13, 20].includes(index)) {
    const filename = index === 0 ? 'annals-date-conflict'
      : index === 13 ? 'hearthglen-libram' : 'family-homecoming';
    await captureVisualReview(page, { path: `output/darrowshire-visual-review/${profile}-${filename}.png` });
  }
}

test('Darrowshire traverses all 21 research scenes with cited transcripts and loaded art', async ({ page }) => {
  test.setTimeout(600_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(21);
  expect(story.nodes).toHaveLength(21);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/darrowshire-lost-and-remembered');
  await expect(page.getByRole('heading', { level: 1, name: 'Darrowshire: Lost and Remembered' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=darrowshire-lost-and-remembered/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/darrowshire-lost-and-remembered$/);
  expect(pageErrors).toEqual([]);
});

test('Darrowshire’s environments and cast fit the phone viewport across all scenes', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=darrowshire-lost-and-remembered');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/darrowshire-lost-and-remembered$/);
});
