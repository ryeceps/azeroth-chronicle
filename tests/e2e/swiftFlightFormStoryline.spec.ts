import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'swift-flight-form-raven-legacy';
const story = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: Array<{ id: string; title: string; narration: string; entityIds?: string[]; visualActions?: Array<{ mapStateId?: string }> }>;
};
const nodes = story.guide.nodeIds.map((id) => story.nodes.find((node) => node.id === id)!);
const entities = new Map<string, { mapFigure?: { asset: string; eraVariants?: Array<{ eraId: string; asset: string }> }; mapVisual?: { asset: string } }>();
for (const entityId of new Set(nodes.flatMap((node) => node.entityIds ?? []))) {
  entities.set(entityId, JSON.parse(readFileSync(`data/entities/${entityId}.research.json`, 'utf8')));
}
const storyRoot = `/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${storyId}`;
const screenshotNodes = new Set([0, 3, 6, 9, 11, 14, 15, 16]);
mkdirSync(`output/${storyId}-visual-review/desktop`, { recursive: true });
mkdirSync(`output/${storyId}-visual-review/phone`, { recursive: true });

test('Swift Flight Form renders every cited story scene on desktop and phone', async ({ page }) => {
  test.setTimeout(600_000);
  expect(nodes).toHaveLength(17);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const device of ['desktop', 'phone'] as const) {
    await page.setViewportSize(device === 'desktop' ? { width: 1920, height: 1080 } : { width: 390, height: 844 });
    await page.goto(`${storyRoot}&node=${nodes[0]!.id}&play=story`);
    const pause = page.getByRole('button', { name: 'Pause tour' });
    if (await pause.isVisible()) await pause.click();

    for (const [index, node] of nodes.entries()) {
      if (index > 0) await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
      await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);

      const mapStateId = node.visualActions?.find((action) => action.mapStateId)?.mapStateId;
      expect(mapStateId).toBeTruthy();
      const mapState = JSON.parse(readFileSync(`data/map-states/${mapStateId}.research.json`, 'utf8')) as { terrainTextureAsset: string };
      const environment = page.locator('.story-atmosphere img');
      await expect.poll(() => environment.getAttribute('src')).toContain(mapState.terrainTextureAsset);
      await expect.poll(() => environment.evaluate((image: HTMLImageElement) =>
        image.complete && image.naturalWidth >= 700 && image.naturalHeight >= 400)).toBe(true);

      const stageFigures = page.locator('.map-character-figure, .map-subject-visual');
      await expect(stageFigures).toHaveCount(node.entityIds?.length ?? 0);
      for (const entityId of node.entityIds ?? []) {
        const entity = entities.get(entityId)!;
        const eraVariant = entity.mapFigure?.eraVariants?.find((variant) => variant.eraId === 'age-of-adventurers');
        const asset = eraVariant?.asset ?? entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        expect(asset, `${node.title} needs a deliberate image for ${entityId}`).toBeTruthy();
        await expect.poll(() => page.locator('img').evaluateAll((images, expectedAsset) => {
          const image = images.find((candidate) => (candidate as HTMLImageElement).src.endsWith(`/${expectedAsset}`)) as HTMLImageElement | undefined;
          return image?.complete && image.naturalWidth >= 256 ? image.naturalWidth : 0;
        }, asset!), `${node.title}: expected a loaded image for ${entityId}`).toBeGreaterThanOrEqual(256);
      }

      await expect.poll(async () => {
        const viewportBounds = await page.locator('.map-viewport').boundingBox();
        return stageFigures.evaluateAll((elements, bounds) => {
          if (!bounds) return elements.map(() => true);
          const left = bounds.x ?? 0;
          const top = bounds.y ?? 0;
          const right = left + (bounds.width ?? 0);
          const bottom = top + (bounds.height ?? 0);
          return elements.map((element) => {
          const rect = element.getBoundingClientRect();
          const intersectionWidth = Math.max(0, Math.min(rect.right, right) - Math.max(rect.left, left));
          const intersectionHeight = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
          return rect.width === 0 || rect.height === 0
            || (intersectionWidth * intersectionHeight) / (rect.width * rect.height) < 0.8;
          }).filter(Boolean);
        }, viewportBounds);
      }, { message: `${node.title}: every character and object should fit the map frame` }).toEqual([]);

      if (device === 'phone') {
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      }
      if (screenshotNodes.has(index)) {
        await captureVisualReview(page, {
          path: `output/${storyId}-visual-review/${device}/${String(index + 1).padStart(2, '0')}-${node.id.slice(storyId.length + 7)}.png`,
          fullPage: true,
        });
      }
    }

    if (device === 'desktop') {
      await page.getByRole('button', { name: 'Finish this storyline' }).click();
      await expect(page).toHaveURL(/tours\/classic-to-wrath\?complete=1$/);
    } else {
      await page.getByRole('button', { name: 'Leave tour' }).click();
      await expect(page).toHaveURL(/tours\/classic-to-wrath$/);
    }
  }
  expect(pageErrors).toEqual([]);
});

test('Classic-to-Wrath opens Swift Flight Form from its map placard', async ({ page }) => {
  await page.goto('/tours/classic-to-wrath');
  const marker = page.getByRole('button', { name: /Swift Flight Form: the raven’s legacy/i });
  await expect(marker).toBeVisible();
  await marker.hover();
  const card = page.locator(`#story-tour-tip-${storyId}`);
  await expect(card).toContainText('Playable story');
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect(page).toHaveURL(/storyline=swift-flight-form-raven-legacy/);
  await expect(page.getByRole('heading', { name: nodes[0]!.title, exact: true })).toBeVisible();
});

test('Classic-to-Wrath Play All crosses into and out of Swift Flight Form', async ({ page }) => {
  const netherwing = JSON.parse(readFileSync('data/stories/netherwing-liberation.research.json', 'utf8')) as { guide: { nodeIds: string[] } };
  const lastNetherwingNodeId = netherwing.guide.nodeIds.at(-1)!;
  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=netherwing-liberation&node=${lastNetherwingNodeId}&play=all`);
  const pause = page.getByRole('button', { name: 'Pause tour' });
  if (await pause.isVisible()) await pause.click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=swift-flight-form-raven-legacy/);
  await expect(page.getByRole('heading', { name: nodes[0]!.title, exact: true })).toBeVisible();

  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${storyId}&node=${nodes.at(-1)!.id}&play=all`);
  if (await pause.isVisible()) await pause.click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=missing-diplomat-original-investigation/);
});
