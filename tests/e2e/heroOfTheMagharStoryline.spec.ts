import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'hero-of-the-maghar';
const story = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: Array<{ id: string; title: string; narration: string; entityIds?: string[]; visualActions?: Array<{ mapStateId?: string }> }>;
};
const nodes = story.guide.nodeIds.map((id) => story.nodes.find((node) => node.id === id)!);
const entities = new Map<string, { mapFigure?: { asset: string; eraVariants?: Array<{ eraId: string; asset: string }> }; mapVisual?: { asset: string } }>();
for (const id of new Set(nodes.flatMap((node) => node.entityIds ?? []))) {
  entities.set(id, JSON.parse(readFileSync(`data/entities/${id}.research.json`, 'utf8')));
}
mkdirSync('output/hero-of-the-maghar-visual-review/desktop', { recursive: true });
mkdirSync('output/hero-of-the-maghar-visual-review/phone', { recursive: true });

test('Hero of the Mag’har plays all illustrated scenes on desktop and phone', async ({ page }) => {
  test.setTimeout(600_000);
  expect(nodes).toHaveLength(15);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const root = `/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=${storyId}`;

  for (const device of ['desktop', 'phone'] as const) {
    await page.setViewportSize(device === 'desktop' ? { width: 1920, height: 1080 } : { width: 390, height: 844 });
    await page.goto(`${root}&node=${nodes[0]!.id}&play=story`);
    const pause = page.getByRole('button', { name: 'Pause tour' });
    if (await pause.isVisible()) await pause.click();

    for (const [index, node] of nodes.entries()) {
      if (index > 0) await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
      await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);

      const mapStateId = node.visualActions?.[0]?.mapStateId;
      expect(mapStateId).toBeTruthy();
      const mapState = JSON.parse(readFileSync(`data/map-states/${mapStateId}.research.json`, 'utf8')) as { terrainTextureAsset: string };
      const environment = page.locator('.story-atmosphere img');
      await expect.poll(() => environment.getAttribute('src')).toContain(mapState.terrainTextureAsset);
      await expect.poll(() => environment.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(500);

      for (const entityId of node.entityIds ?? []) {
        const entity = entities.get(entityId)!;
        const eraVariant = entity.mapFigure?.eraVariants?.find((variant) => variant.eraId === 'age-of-adventurers');
        const asset = eraVariant?.asset ?? entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        expect(asset, `${node.title} must provide a deliberate image for ${entityId}`).toBeTruthy();
        await expect.poll(() => page.locator('img').evaluateAll((images, expectedAsset) => {
          const image = images.find((candidate) => (candidate as HTMLImageElement).src.endsWith(`/${expectedAsset}`)) as HTMLImageElement | undefined;
          return image?.naturalWidth ?? 0;
        }, asset!), `${node.title}: expected rendered image for ${entityId}`).toBeGreaterThan(256);
      }

      await expect.poll(async () => {
        const viewportBounds = await page.locator('.map-viewport').boundingBox();
        return page.locator('.map-character-figure, .map-subject-visual').evaluateAll((elements, bounds) => elements.map((element) => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, right: x + width, bottom: y + height };
        }).filter((figure) => !bounds
          || figure.x < bounds.x - 1
          || figure.y < bounds.y - 1
          || figure.right > bounds.x + bounds.width + 1
          || figure.bottom > bounds.y + bounds.height + 1), viewportBounds);
      }, { message: `${node.title} figures should settle inside the map viewport` }).toEqual([]);

      if (device === 'phone') {
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      }
      await captureVisualReview(page, {
        path: `output/hero-of-the-maghar-visual-review/${device}/${String(index + 1).padStart(2, '0')}-${node.id.slice(storyId.length + 7)}.png`,
        fullPage: true,
      });
    }

    if (device === 'desktop') {
      await page.getByRole('button', { name: 'Finish this storyline' }).click();
      await expect(page).toHaveURL(/tours\/classic-to-wrath\?complete=1$/);
    } else {
      await page.getByRole('button', { name: 'Leave tour' }).click();
      await expect(page).toHaveURL(/tours\/classic-to-wrath$/);
    }
  }
  expect(errors).toEqual([]);
});

test('Classic-to-Wrath map opens the Mag’har story placard', async ({ page }) => {
  await page.goto('/tours/classic-to-wrath');
  const marker = page.getByRole('button', { name: /Hero of the Mag'har: Garrosh, Geyah, and Thrall's Return/i });
  await expect(marker).toBeVisible();
  await marker.hover();
  const card = page.locator('#story-tour-tip-hero-of-the-maghar');
  await expect(card).toContainText('Playable story');
  await card.getByRole('button', { name: 'Play story' }).click();
  await expect(page).toHaveURL(/storyline=hero-of-the-maghar/);
  await expect(page.getByRole('heading', { name: nodes[0]!.title, exact: true })).toBeVisible();
});

test('Play All advances from Karazhan through the Consortium story into the Mag’har', async ({ page }) => {
  const karazhan = JSON.parse(readFileSync('data/stories/karazhan-masters-key-and-nightbane.research.json', 'utf8')) as {
    guide: { nodeIds: string[] };
    nodes: Array<{ id: string; title: string }>;
  };
  const consortium = JSON.parse(readFileSync('data/stories/consortium-and-arcatraz.research.json', 'utf8')) as {
    guide: { nodeIds: string[] };
    nodes: Array<{ id: string; title: string }>;
  };
  const finalNodeId = karazhan.guide.nodeIds.at(-1)!;
  const finalNode = karazhan.nodes.find((node) => node.id === finalNodeId)!;
  const firstConsortiumNode = consortium.nodes.find((node) => node.id === consortium.guide.nodeIds[0])!;
  const finalConsortiumNodeId = consortium.guide.nodeIds.at(-1)!;
  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=karazhan-masters-key-and-nightbane&node=${finalNodeId}&play=all`);
  const pause = page.getByRole('button', { name: 'Pause tour' });
  if (await pause.isVisible()) await pause.click();
  await expect(page.getByRole('heading', { name: finalNode.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=consortium-and-arcatraz/);
  await expect(page.getByRole('heading', { name: firstConsortiumNode.title, exact: true })).toBeVisible();
  await page.goto(`/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=consortium-and-arcatraz&node=${finalConsortiumNodeId}&play=all`);
  const finalConsortiumHeading = consortium.nodes.find((node) => node.id === finalConsortiumNodeId)!.title;
  await expect(page.getByRole('heading', { name: finalConsortiumHeading, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=hero-of-the-maghar/);
  await expect(page.getByRole('heading', { name: nodes[0]!.title, exact: true })).toBeVisible();
});
