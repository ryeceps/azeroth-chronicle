import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'champion-of-the-naaru-outland-trials';
const data = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: Array<{ id: string; title: string; narration: string; entityIds?: string[]; visualActions?: Array<{ mapStateId?: string }> }>;
};
const nodes = data.guide.nodeIds.map((id) => data.nodes.find((node) => node.id === id)!);
const entities = new Map<string, { mapFigure?: { asset: string }; mapVisual?: { asset: string } }>();
for (const id of new Set(nodes.flatMap((node) => node.entityIds ?? []))) {
  entities.set(id, JSON.parse(readFileSync(`data/entities/${id}.research.json`, 'utf8')));
}
mkdirSync('output/champion-of-the-naaru-visual-review/desktop', { recursive: true });
mkdirSync('output/champion-of-the-naaru-visual-review/phone', { recursive: true });

test('Champion of the Naaru traverses every illustrated scene on desktop and phone', async ({ page }) => {
  test.setTimeout(300_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const root = `/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${storyId}`;

  for (const device of ['desktop', 'phone'] as const) {
    await page.setViewportSize(device === 'desktop' ? { width: 1920, height: 1080 } : { width: 390, height: 844 });
    await page.goto(`${root}&node=${nodes.at(0)!.id}&play=story`);
    const pause = page.getByRole('button', { name: 'Pause tour' });
    if (await pause.isVisible()) await pause.click();

    for (const [index, node] of nodes.entries()) {
      if (index > 0) await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
      await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);

      const environment = page.locator('.story-atmosphere img');
      const mapStateId = node.visualActions?.[0]?.mapStateId;
      expect(mapStateId).toBeTruthy();
      const mapState = JSON.parse(readFileSync(`data/map-states/${mapStateId}.research.json`, 'utf8')) as { terrainTextureAsset: string };
      await expect.poll(() => environment.getAttribute('src')).toContain(mapState.terrainTextureAsset);
      await expect.poll(() => environment.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(500);

      for (const entityId of node.entityIds ?? []) {
        const entity = entities.get(entityId)!;
        const asset = entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        if (!asset) continue;
        await expect.poll(() => page.locator('img').evaluateAll((images, expectedAsset) => {
          const image = images.find((candidate) => (candidate as HTMLImageElement).src.endsWith(`/${expectedAsset}`)) as HTMLImageElement | undefined;
          return image?.naturalWidth ?? 0;
        }, asset)).toBeGreaterThan(256);
      }

      const viewportBounds = await page.locator('.map-viewport').boundingBox();
      const figureBounds = await page.locator('.map-character-figure, .map-subject-visual').evaluateAll((elements) =>
        elements.map((element) => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, right: x + width, bottom: y + height };
        }));
      const offscreenFigures = figureBounds.filter((figure) => !viewportBounds
        || figure.x < viewportBounds.x - 1
        || figure.y < viewportBounds.y - 1
        || figure.right > viewportBounds.x + viewportBounds.width + 1
        || figure.bottom > viewportBounds.y + viewportBounds.height + 1);
      expect(offscreenFigures, `${node.title} figure bounds: ${JSON.stringify(figureBounds)}`).toEqual([]);

      if (device === 'phone') {
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      }
      await captureVisualReview(page, {
        path: `output/champion-of-the-naaru-visual-review/${device}/${String(index + 1).padStart(2, '0')}-${node.id.slice(storyId.length + 7)}.png`,
        fullPage: true,
      });
    }
  }

  expect(errors).toEqual([]);
});

test('Classic-to-Wrath Play All continues from the Cipher into the Naaru trials', async ({ page }) => {
  const lastCipherNodeId = 'cipher-of-damnation-oronok-story-the-mark-of-kaelthas';
  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=cipher-of-damnation-oronok&node=${lastCipherNodeId}&play=all`);
  const pause = page.getByRole('button', { name: 'Pause tour' });
  if (await pause.isVisible()) await pause.click();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=champion-of-the-naaru-outland-trials/);
  await expect(page.getByRole('heading', { name: 'A letter after the Cipher', exact: true })).toBeVisible();
});
