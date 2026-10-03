import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const tour = JSON.parse(readFileSync('data/story-tours/classic-to-wrath.research.json', 'utf8')) as {
  entries: { storylineId: string; mapPositionPercent: [number, number] }[];
};

for (const viewport of [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }, { width: 390, height: 844 }]) {
  test(`@smoke story map fills ${viewport.width}×${viewport.height} and preserves all image anchors`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/tours/classic-to-wrath');
    const image = page.locator('.story-tour-map-image');
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    expect(await page.locator('.story-tour-map-frame').boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
    const imageBox = (await image.boundingBox())!;
    expect(imageBox.x).toBeLessThanOrEqual(0);
    expect(imageBox.y).toBeLessThanOrEqual(0);
    expect(imageBox.x + imageBox.width).toBeGreaterThanOrEqual(viewport.width);
    expect(imageBox.y + imageBox.height).toBeGreaterThanOrEqual(viewport.height);
    const play = page.getByRole('button', { name: 'Play all stories' });
    const playBox = (await play.boundingBox())!;
    expect(playBox.x).toBeGreaterThan(viewport.width / 2);
    expect(playBox.y).toBeLessThan(25);
    await expect(page.getByRole('link', { name: 'Tours', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Archive', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Unofficial fan atlas/ })).toBeVisible();
    await expect(page.locator('.story-tour-dot')).toHaveCount(tour.entries.length);
    for (const entry of tour.entries) {
      const marker = page.locator(`.story-tour-marker:has(#story-tour-tip-${entry.storylineId})`);
      const box = (await marker.boundingBox())!;
      expect(box.x + box.width / 2).toBeCloseTo(imageBox.x + imageBox.width * entry.mapPositionPercent[0] / 100, 0);
      expect(box.y + box.height / 2).toBeCloseTo(imageBox.y + imageBox.height * entry.mapPositionPercent[1] / 100, 0);
      const dot = marker.locator('.story-tour-dot');
      await dot.focus();
      await expect(dot).toBeFocused();
      await dot.click({ trial: true });
    }
    await page.mouse.move(0, viewport.height);
    await page.locator('.story-tour-dot').last().evaluate((dot: HTMLButtonElement) => dot.blur());
    await page.screenshot({ path: `output/fullscreen-story-map-${viewport.width}.png`, animations: 'disabled' });
  });
}
