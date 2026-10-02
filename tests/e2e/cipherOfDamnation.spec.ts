import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const storyId = 'cipher-of-damnation-oronok';
const data = JSON.parse(readFileSync(`data/stories/${storyId}.research.json`, 'utf8')) as {
  guide: { nodeIds: string[] };
  nodes: Array<{ id: string; title: string; narration: string; entityIds?: string[]; visualActions?: Array<{ mapStateId?: string }> }>;
};
const nodes = data.guide.nodeIds.map((id) => data.nodes.find((node) => node.id === id)!);
const entities = new Map<string, { mapFigure?: { asset: string }; mapVisual?: { asset: string } }>();
for (const id of new Set(nodes.flatMap((node) => node.entityIds ?? []))) {
  entities.set(id, JSON.parse(readFileSync(`data/entities/${id}.research.json`, 'utf8')));
}
mkdirSync('output/cipher-visual-review/desktop', { recursive: true });
mkdirSync('output/cipher-visual-review/phone', { recursive: true });

test('Cipher guide traverses every scene with loaded area, figure, and object art on desktop and phone', async ({ page }) => {
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
      if (index > 0) {
        await page.getByRole('button', { name: 'Next', exact: true }).click();
      }
      await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
      await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);

      const environment = page.locator('.story-atmosphere img');
      const mapStateId = node.visualActions?.[0]?.mapStateId;
      expect(mapStateId).toBeTruthy();
      const mapStateFileId = mapStateId!.replace(/-scene$/, '');
      const mapState = JSON.parse(readFileSync(`data/map-states/${mapStateFileId}.research.json`, 'utf8')) as { terrainTextureAsset: string };
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

      await page.screenshot({
        path: `output/cipher-visual-review/${device}/${String(index + 1).padStart(2, '0')}-${node.id.slice(storyId.length + 7)}.png`,
        fullPage: true,
      });
    }
  }

  expect(errors).toEqual([]);
});
