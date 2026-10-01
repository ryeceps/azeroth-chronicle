import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/dungeon-set-two-veiled-blade.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; eventIds: string[] }[];
};

mkdirSync('output/dungeon-set-two-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, title: string, index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/dungeon-set-two\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Environment image loads for ${title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment and cast images load for ${title}` }).toBe(true);
  if (!process.env.CI) {
    await page.screenshot({
      path: `output/dungeon-set-two-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${story.nodes[index]!.id}.png`,
    });
  }
}

test('Dungeon Set 2 traverses every cited scene and returns to its text-first story page', async ({ page }) => {
  test.setTimeout(180_000);
  expect(story.guide.nodeIds).toHaveLength(22);
  expect(story.nodes).toHaveLength(22);
  expect(story.nodes.filter((node) => node.title.startsWith('Alternative fate ·'))).toHaveLength(4);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/dungeon-set-two-veiled-blade');
  await expect(page.getByRole('heading', { level: 1, name: 'The Veiled Blade and Lord Valthalak' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=dungeon-set-two-veiled-blade/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.screenshot({ path: 'output/dungeon-set-two-visual-review/desktop-final.png' });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/dungeon-set-two-veiled-blade$/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Veiled Blade and Lord Valthalak' })).toBeVisible();
});

test('Dungeon Set 2 keeps every scene and its cast visible at phone width', async ({ page }) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=dungeon-set-two-veiled-blade');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: 'output/dungeon-set-two-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/dungeon-set-two-veiled-blade$/);
});
