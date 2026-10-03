import { captureVisualReview, visualReviewEnabled } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/tirion-taelan-of-love-and-family.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};

mkdirSync('output/tirion-taelan-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, title: string, index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/tirion-taelan\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 700 && image.naturalHeight >= 400),
  { message: `Eastern Kingdoms environment image loads for ${title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
      && image.currentSrc.endsWith('.research.webp');
  })), { message: `Environment, cast and object images load for ${title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(story.nodes[index]!.entityIds.length);

  if (visualReviewEnabled && [0, 6, 13].includes(index)) {
    const filename = index === 0 ? 'desktop-thondroril-hermit.png'
      : index === 6 ? 'desktop-family-portrait.png' : 'desktop-silver-hand-oath.png';
    const profileFilename = profile === 'desktop' ? filename : filename.replace('desktop-', 'phone-');
    await captureVisualReview(page, { path: `output/tirion-taelan-visual-review/${profileFilename}` });
  }
}

test('Tirion and Taelan traverses all 14 Classic scenes with their area, cast and objects', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(14);
  expect(story.nodes).toHaveLength(14);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/tirion-taelan-of-love-and-family');
  await expect(page.getByRole('heading', { level: 1, name: 'Tirion and Taelan: Of Love and Family' })).toBeVisible();
  await expect(page.getByText(/two Classic quests named Of Love and Family remain separate/i)).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=tirion-taelan-of-love-and-family/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/tirion-taelan-of-love-and-family$/);
  expect(pageErrors).toEqual([]);
});

test('Tirion and Taelan scene art fits at phone width', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=tirion-taelan-of-love-and-family');
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
  await expect(page).toHaveURL(/storylines\/tirion-taelan-of-love-and-family$/);
});
