import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/fallen-hero-and-rakhlikh.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; eventIds: string[] }[];
};

mkdirSync('output/fallen-hero-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, title: string, index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/fallen-hero\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 700 && image.naturalHeight >= 400),
  { message: 'Classic-area environment image loads for ' + title }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
      && image.currentSrc.endsWith('.research.webp');
  })), { message: 'Environment, cast and object images load for ' + title }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(story.nodes[index]!.entityIds.length);

  if (!process.env.CI) {
    await page.screenshot({
      path: 'output/fallen-hero-visual-review/' + profile + '-'
        + String(index + 1).padStart(2, '0') + '-' + story.nodes[index]!.id + '.png',
    });
  }
}

test('Fallen Hero traverses all 15 Classic scenes with their area, cast and object art', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(15);
  expect(story.nodes).toHaveLength(15);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/fallen-hero-and-rakhlikh');
  await expect(page.getByRole('heading', { level: 1, name: 'The Fallen Hero and Rakh’likh' })).toBeVisible();
  await expect(page.getByText(/eighteen-stone\/nineteen-soldier conflict stays unresolved/i)).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=fallen-hero-and-rakhlikh/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.screenshot({ path: 'output/fallen-hero-visual-review/desktop-final.png' });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/fallen-hero-and-rakhlikh$/);
  expect(pageErrors).toEqual([]);
});

test('Fallen Hero scenes and figures fit at phone width', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=fallen-hero-and-rakhlikh');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: 'output/fallen-hero-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/fallen-hero-and-rakhlikh$/);
});
