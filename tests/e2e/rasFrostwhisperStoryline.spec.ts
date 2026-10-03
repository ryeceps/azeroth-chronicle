import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/ras-frostwhisper-and-the-soulbound-keepsake.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[] }[];
};
const visualLedger = JSON.parse(readFileSync('docs/research/ras-frostwhisper-visual-assets.json', 'utf8')) as {
  sceneLedger: { nodeId: string; environmentPath: string }[];
};

mkdirSync('output/ras-frostwhisper-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, index: number, profile: 'desktop' | 'phone') {
  const node = story.nodes[index]!;
  const visual = visualLedger.sceneLedger[index]!;
  expect(visual.nodeId).toBe(node.id);

  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  const path = visual.environmentPath.replace(/^public/, '');
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) => new URL(image.src).pathname))
    .toContain(path);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Environment image loads for ${node.title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment, cast and object images load for ${node.title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
  await expect(page.locator('.map-label')).toHaveCount(0);

  await page.screenshot({
    path: `output/ras-frostwhisper-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${node.id}.png`,
  });
}

test('Ras Frostwhisper traverses the cited illustrated story on desktop', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(13);
  expect(story.nodes).toHaveLength(13);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/ras-frostwhisper-and-the-soulbound-keepsake');
  await expect(page.getByRole('heading', { level: 1, name: 'Ras Frostwhisper: a lich’s mortality' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=ras-frostwhisper-and-the-soulbound-keepsake/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
    await expectIllustratedScene(page, index, 'desktop');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await expect(pageErrors).toEqual([]);
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/ras-frostwhisper-and-the-soulbound-keepsake$/);
});

test('Ras Frostwhisper keeps every scene and figure visible at phone width', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=ras-frostwhisper-and-the-soulbound-keepsake');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, index, 'phone');
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/ras-frostwhisper-and-the-soulbound-keepsake$/);
});
