import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('data/stories/karazhan-masters-key-and-nightbane.research.json', 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: { id: string; title: string; narration: string; entityIds: string[]; eventIds: string[] }[];
};

mkdirSync('output/karazhan-visual-review', { recursive: true });

async function expectIllustratedScene(page: Page, title: string, index: number, profile: 'desktop' | 'phone') {
  const environment = page.locator('.story-atmosphere img');
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(environment).toHaveAttribute('src', /images\/storylines\/karazhan\/.*\.research\.webp$/);
  await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
    image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512),
  { message: `Environment image loads for ${title}` }).toBe(true);
  await expect.poll(() => images.evaluateAll((elements) => elements.every((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 400 && image.naturalHeight >= 400
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment, cast and object images load for ${title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(story.nodes[index]!.entityIds.length);

  if (!process.env.CI) {
    await page.screenshot({
      path: `output/karazhan-visual-review/${profile}-${String(index + 1).padStart(2, '0')}-${story.nodes[index]!.id}.png`,
    });
  }
}

test('Karazhan traverses all cited scenes, shows Atiesh with Medivh, and returns to its text-first story page', async ({ page }) => {
  test.setTimeout(240_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  expect(story.guide.nodeIds).toHaveLength(18);
  expect(story.nodes).toHaveLength(18);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/karazhan-masters-key-and-nightbane');
  await expect(page.getByRole('heading', { level: 1, name: 'Karazhan: The Master’s Key and Nightbane' })).toBeVisible();
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=karazhan-masters-key-and-nightbane/);
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (node.id.endsWith('memory-of-arcanagos')) {
      const medivhFigure = page.locator('.map-character-figure img[src*="/medivh-atiesh.research.webp"]');
      await expect(medivhFigure).toBeVisible();
      await expect.poll(() => medivhFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      await expect.poll(() => medivhFigure.evaluate((image: HTMLImageElement) => image.getBoundingClientRect().height)).toBeGreaterThanOrEqual(240);
      await page.screenshot({ path: 'output/karazhan-visual-review/medivh-atiesh-desktop.png', fullPage: true });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.screenshot({ path: 'output/karazhan-visual-review/desktop-final.png' });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/karazhan-masters-key-and-nightbane$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Karazhan: The Master’s Key and Nightbane' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Karazhan keeps its scenes and cast visible at phone width', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=karazhan-masters-key-and-nightbane');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if (node.id.endsWith('memory-of-arcanagos')) {
      const medivhFigure = page.locator('.map-character-figure img[src*="/medivh-atiesh.research.webp"]');
      await expect(medivhFigure).toBeVisible();
      await expect.poll(() => medivhFigure.evaluate((image: HTMLImageElement) => image.getBoundingClientRect().height)).toBeGreaterThanOrEqual(120);
      await page.screenshot({ path: 'output/karazhan-visual-review/medivh-atiesh-phone.png', fullPage: true });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: 'output/karazhan-visual-review/phone-final.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/karazhan-masters-key-and-nightbane$/);
});
