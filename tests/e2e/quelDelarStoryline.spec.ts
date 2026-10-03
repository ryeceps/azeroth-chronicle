import { captureVisualReview } from './helpers/visualReview';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const story = JSON.parse(readFileSync('data/stories/quel-delar-restored.research.json', 'utf8')) as {
  nodes: {
    id: string;
    title: string;
    narration: string;
    entityIds: string[];
    visualActions: { type: string; mapStateId?: string }[];
    voiceover: { assetPath: string };
  }[];
};

const visualSelector = '.map-character-figure, .map-subject-visual';

async function expectIllustratedScene(page: Page, node: (typeof story.nodes)[number]) {
  const environment = page.locator('.story-atmosphere img');
  await expect(environment).toHaveAttribute('src', /quel-delar-restored\/.*\.research\.webp$/);
  await expect.poll(() => page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img').evaluateAll(elements =>
    elements.length > 0 && elements.every(element => {
      const image = element as HTMLImageElement;
      return image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512;
    })), { message: 'Scene art loads in ' + node.title }).toBe(true);
  await expect(page.locator(visualSelector)).toHaveCount(node.entityIds.length);
}

async function expectFiguresFit(page: Page, title: string) {
  // Collision layout settles after image decode and projected camera updates.
  await expect.poll(() => page.locator(visualSelector).evaluateAll(elements => elements.flatMap((element, index) => {
    const box = element.getBoundingClientRect();
    const label = element.querySelector('span')?.getBoundingClientRect();
    const name = element.getAttribute('aria-label') ?? element.textContent?.trim() ?? `figure ${index + 1}`;
    const outside = box.x < 0 || box.right > window.innerWidth || box.y < 0 || box.bottom > window.innerHeight;
    const overlaps = elements.slice(index + 1).flatMap((other, offset) => {
      const next = other.getBoundingClientRect();
      const nextLabel = other.querySelector('span')?.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(box.right, next.right) - Math.max(box.left, next.left))
        * Math.max(0, Math.min(box.bottom, next.bottom) - Math.max(box.top, next.top));
      const labelOverlap = label && nextLabel
        ? Math.max(0, Math.min(label.right, nextLabel.right) - Math.max(label.left, nextLabel.left))
          * Math.max(0, Math.min(label.bottom, nextLabel.bottom) - Math.max(label.top, nextLabel.top)) : 0;
      return overlap >= Math.min(box.width * box.height, next.width * next.height) * 0.15 || labelOverlap
        ? [{ with: other.getAttribute('aria-label') ?? other.textContent?.trim() ?? `figure ${index + offset + 2}`, overlap, labelOverlap }]
        : [];
    });
    return outside || overlaps.length > 0 ? [{
      name,
      box: { x: box.x, y: box.y, width: box.width, height: box.height },
      layout: { x: element.getAttribute('data-layout-css-x'), y: element.getAttribute('data-layout-css-y') },
      outside,
      overlaps,
    }] : [];
  })), { message: 'Figures fit without material overlap in ' + title }).toEqual([]);
}

async function captureUniqueScene(page: Page, prefix: string, node: (typeof story.nodes)[number], index: number, captured: Set<string>) {
  const mapStateId = node.visualActions.find(action => action.type === 'set_map_state')?.mapStateId;
  if (!mapStateId || captured.has(mapStateId)) return;
  captured.add(mapStateId);
  const folder = resolve('output/quel-delar-visual-review');
  mkdirSync(folder, { recursive: true });
  await captureVisualReview(page, { path: resolve(folder, prefix + '-' + String(index + 1).padStart(2, '0') + '-' + mapStateId.replace('quel-delar-restored-', '').replace('-scene', '') + '.png'), fullPage: true });
}

test('Quel’Delar plays all nineteen illustrated scenes and returns to its dossier', async ({ page }) => {
  test.setTimeout(360_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=quel-delar-restored');
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();
  const capturedScenes = new Set<string>();
  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('audio')).toHaveAttribute('src', '/' + node.voiceover.assetPath);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    await expectIllustratedScene(page, node);
    await captureUniqueScene(page, 'desktop', node, index, capturedScenes);
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await captureVisualReview(page, { path: resolve('output/quel-delar-visual-review/desktop-final-dalaran-return.png'), fullPage: true });
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/quel-delar-restored$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Quel’Delar: The Broken Blade Restored' })).toBeVisible();
});

test('Quel’Delar direct links and every illustrated scene fit a phone viewport', async ({ page }) => {
  test.setTimeout(360_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=quel-delar-restored');
  await page.getByRole('button', { name: 'Pause tour' }).click();
  const capturedScenes = new Set<string>();
  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expectIllustratedScene(page, node);
    await expectFiguresFit(page, node.title);
    await captureUniqueScene(page, 'phone', node, index, capturedScenes);
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await captureVisualReview(page, { path: resolve('output/quel-delar-visual-review/phone-final-dalaran-return.png'), fullPage: true });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/quel-delar-restored$/);
});
