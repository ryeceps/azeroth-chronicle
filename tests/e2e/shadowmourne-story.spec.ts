import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'shadowmourne-and-arthas-relics';
const story = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  nodes: { id: string; title: string; narration: string; entityIds: string[]; voiceover: { assetPath: string } }[];
};

mkdirSync('output/shadowmourne-visual-review', { recursive: true });

async function expectSceneRendered(page: Page, node: typeof story.nodes[number]) {
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(page.locator('.story-atmosphere img')).toHaveAttribute('src', /shadowmourne-and-arthas-relics\/.*\.research\.webp$/);
  await expect.poll(() => images.evaluateAll(elements => elements.every(element => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment and cast art load in ${node.title}` }).toBe(true);
  await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
}

async function expectFiguresFit(page: Page) {
  await expect.poll(() => page.locator('.map-character-figure, .map-subject-visual').evaluateAll(elements =>
    elements.every((element, index) => {
      const box = element.getBoundingClientRect();
      const label = element.querySelector('span')?.getBoundingClientRect();
      const clear = elements.slice(index + 1).every(other => {
        const second = other.getBoundingClientRect();
        const otherLabel = other.querySelector('span')?.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(box.right, second.right) - Math.max(box.left, second.left))
          * Math.max(0, Math.min(box.bottom, second.bottom) - Math.max(box.top, second.top));
        const labelOverlap = label && otherLabel
          ? Math.max(0, Math.min(label.right, otherLabel.right) - Math.max(label.left, otherLabel.left))
            * Math.max(0, Math.min(label.bottom, otherLabel.bottom) - Math.max(label.top, otherLabel.top)) : 0;
        return overlap < Math.min(box.width * box.height, second.width * second.height) * 0.15 && !labelOverlap;
      });
      return clear && box.x >= 0 && box.right <= window.innerWidth && box.y >= 0 && box.bottom <= window.innerHeight;
    })), { message: 'Every cast and artifact figure fits without obscuring another figure or label' }).toBe(true);
}

test('Shadowmourne map stop opens and traverses every illustrated scene on desktop and phone', async ({ page }) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tours/classic-to-wrath');
  await expect(page.locator('.story-tour-dot')).toHaveCount(24);
  const map = page.getByRole('img', { name: /original interpretive world atlas/i });
  await expect(map).toBeVisible();
  await expect.poll(() => map.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: 'output/shadowmourne-visual-review/story-tour-desktop.png', animations: 'disabled' });

  const marker = page.locator('.story-tour-dot[aria-describedby="story-tour-tip-shadowmourne-and-arthas-relics"]');
  await expect(marker).toBeVisible();
  await marker.hover();
  const placard = page.locator('#story-tour-tip-shadowmourne-and-arthas-relics');
  await expect(placard.getByRole('heading', { name: 'Shadowmourne and the relics of the fallen king' })).toBeVisible();
  await expect(placard).toContainText('Playable story');
  await placard.getByRole('button', { name: 'Play story' }).click();
  await expect(page).toHaveURL(/storyline=shadowmourne-and-arthas-relics/);
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('audio')).toHaveAttribute('src', `/${node.voiceover.assetPath}`);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED STORY THEATER');
    await expectSceneRendered(page, node);
    if ([0, 4, 10, 11, 16].includes(index)) {
      await page.screenshot({ path: `output/shadowmourne-visual-review/desktop-${String(index + 1).padStart(2, '0')}.png`, animations: 'disabled' });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tours/classic-to-wrath');
  await expect(page.locator('.story-tour-dot')).toHaveCount(24);
  await expect(page.locator('.story-tour-map-frame')).toHaveJSProperty('clientWidth', 390);
  await page.screenshot({ path: 'output/shadowmourne-visual-review/story-tour-phone.png', animations: 'disabled' });
  await page.locator('.story-tour-dot[aria-describedby="story-tour-tip-shadowmourne-and-arthas-relics"]').hover();
  await page.locator('#story-tour-tip-shadowmourne-and-arthas-relics').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: story.nodes[0]!.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();

  for (const [index, node] of story.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('audio')).toHaveAttribute('src', `/${node.voiceover.assetPath}`);
    await expectSceneRendered(page, node);
    await expectFiguresFit(page);
    if ([4, 10, 11, 16].includes(index)) {
      await page.screenshot({ path: `output/shadowmourne-visual-review/phone-${String(index + 1).padStart(2, '0')}.png`, animations: 'disabled' });
    }
    if (index < story.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
