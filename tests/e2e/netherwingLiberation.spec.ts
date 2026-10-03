import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'netherwing-liberation';
const visualDevices: Array<'desktop' | 'phone'> = process.env.PLAYWRIGHT_STORY_DEVICE === 'phone'
  ? ['phone']
  : ['desktop', 'phone'];
const story = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: Array<{ id: string; title: string; narration: string; entityIds?: string[]; visualActions?: Array<{ mapStateId?: string }> }>;
};
const nodes = story.guide.nodeIds.map((id) => story.nodes.find((node) => node.id === id)!);
const entities = new Map<string, {
  mapFigure?: { asset: string; eraVariants?: Array<{ eraId: string; asset: string }> };
  mapVisual?: { asset: string };
}>();
for (const id of new Set(nodes.flatMap((node) => node.entityIds ?? []))) {
  entities.set(id, JSON.parse(readFileSync(`data/entities/${id}.research.json`, 'utf8')));
}
mkdirSync('output/netherwing-liberation-visual-review/desktop', { recursive: true });
mkdirSync('output/netherwing-liberation-visual-review/phone', { recursive: true });

test('Netherwing renders every illustrated story scene on desktop and phone', async ({ page }) => {
  test.setTimeout(600_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const root = `/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${storyId}`;

  for (const device of visualDevices) {
    await page.setViewportSize(device === 'desktop' ? { width: 1920, height: 1080 } : { width: 390, height: 844 });
    await page.goto(`${root}&node=${nodes[0]!.id}&play=story`);
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
        const eraVariant = entity.mapFigure?.eraVariants?.find((variant) => variant.eraId === 'age-of-adventurers');
        const asset = eraVariant?.asset ?? entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        if (!asset) continue;
        await expect.poll(() => page.locator('img').evaluateAll((images, expectedAsset) => {
          const image = images.find((candidate) => (candidate as HTMLImageElement).src.endsWith(`/${expectedAsset}`)) as HTMLImageElement | undefined;
          return image?.naturalWidth ?? 0;
        }, asset), `${node.title}: expected the rendered ${entityId} image ${asset}`).toBeGreaterThan(256);
      }

      await expect.poll(async () => {
        const viewportBounds = await page.locator('.map-viewport').boundingBox();
        const figureBounds = await page.locator('.map-character-figure, .map-subject-visual').evaluateAll((elements) =>
          elements.map((element) => {
            const { x, y, width, height } = element.getBoundingClientRect();
            return { x, y, right: x + width, bottom: y + height };
          }));
        return figureBounds.filter((figure) => !viewportBounds
          || figure.x < viewportBounds.x - 1
          || figure.y < viewportBounds.y - 1
          || figure.right > viewportBounds.x + viewportBounds.width + 1
          || figure.bottom > viewportBounds.y + viewportBounds.height + 1);
      }, { message: `${node.title} figures should settle inside the map viewport` }).toEqual([]);

      if (device === 'phone') {
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      }
      await captureVisualReview(page, {
        path: `output/netherwing-liberation-visual-review/${device}/${String(index + 1).padStart(2, '0')}-${node.id.slice(storyId.length + 7)}.png`,
        fullPage: true,
      });
    }
  }

  expect(errors).toEqual([]);
});

test('Classic-to-Wrath Play All advances from Champion of the Naaru into Netherwing', async ({ page }) => {
  const previousStoryId = 'champion-of-the-naaru-outland-trials';
  const previousStory = JSON.parse(readFileSync(`data/stories/${previousStoryId}.research.json`, 'utf8')) as { guide: { nodeIds: string[] } };
  const lastNodeId = previousStory.guide.nodeIds.at(-1)!;
  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${previousStoryId}&node=${lastNodeId}&play=all`);
  const pause = page.getByRole('button', { name: 'Pause tour' });
  if (await pause.isVisible()) await pause.click();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=netherwing-liberation/);
  await expect(page.getByRole('heading', { name: nodes[0]!.title, exact: true })).toBeVisible();
});
