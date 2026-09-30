import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const scepter = JSON.parse(readFileSync('data/stories/scepter-of-the-shifting-sands.research.json', 'utf8')) as {
  nodes: { title: string; narration: string; entityIds: string[]; voiceover: { assetPath: string } }[];
};

async function expectIllustratedScene(page: Page, title: string, index: number, profile: string) {
  const images = page.locator('.story-atmosphere img, .map-character-figure img, .map-subject-visual img');
  await expect(page.locator('.story-atmosphere img')).toHaveAttribute('src', /scepter\/.*\.research\.webp$/);
  await expect.poll(() => images.evaluateAll(elements => elements.every(element => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth >= 512 && image.naturalHeight >= 512
      && !image.currentSrc.endsWith('.svg');
  })), { message: `Environment and illustrated cast actually load in ${title}` }).toBe(true);
  // Full local contact sheets support human visual review. CI still verifies every
  // image and scene, but repeated large WebGL captures can exhaust its CPU budget.
  if (!process.env.CI) {
    await page.screenshot({ path: `output/scepter-visual-review/${profile}-${String(index + 1).padStart(2, '0')}.png` });
  }
}

test('Scepter playback traverses every scene and returns to its reading page', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/storylines/scepter-of-the-shifting-sands');
  await page.getByRole('link', { name: 'Experience this storyline' }).click();
  await expect(page).toHaveURL(/tour=storyline&storyline=scepter-of-the-shifting-sands/);
  await page.getByRole('button', { name: 'Pause tour' }).click();
  for (const [index, node] of scepter.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.getByLabel('Chapter transcript')).toHaveText(node.narration);
    await expect(page.locator('audio')).toHaveAttribute('src', `/${node.voiceover.assetPath}`);
    await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expectIllustratedScene(page, node.title, index, 'desktop');
    if (index === 2) {
      await expect(page.locator('.map-character-figure')).toHaveCount(4);
      await page.screenshot({ path: 'output/scepter-desktop.png' });
    }
    if (index < scepter.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/storylines\/scepter-of-the-shifting-sands$/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Scepter of the Shifting Sands' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Leave tour' })).toHaveCount(0);
});

test('Scepter direct links preserve context and reject unknown or mismatched storylines', async ({ page }) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?era=age-of-adventurers&tour=storyline&storyline=scepter-of-the-shifting-sands');
  await expect(page.getByRole('heading', { name: scepter.nodes[0]!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Pause tour' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page).toHaveURL(/storyline=scepter-of-the-shifting-sands/);
  for (const [index, node] of scepter.nodes.entries()) {
    await expect(page.getByRole('heading', { name: node.title, exact: true })).toBeVisible();
    await expect(page.locator('.map-character-figure, .map-subject-visual')).toHaveCount(node.entityIds.length);
    await expect.poll(async () => page.locator('.map-character-figure, .map-subject-visual').evaluateAll(elements =>
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
        return clear && box.x >= 0 && box.x + box.width <= window.innerWidth && box.y >= 0 && box.y + box.height <= window.innerHeight;
      })), { message: `All cast representations fit in ${node.title}` }).toBe(true);
    await expectIllustratedScene(page, node.title, index, 'phone');
    if (index === 2) await page.screenshot({ path: 'output/scepter-phone-cast.png' });
    if (index < scepter.nodes.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: 'output/scepter-phone.png' });
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/storylines\/scepter-of-the-shifting-sands$/);
  for (const query of ['era=black-empire&storyline=scepter-of-the-shifting-sands', 'era=age-of-adventurers&storyline=unknown']) {
    await page.goto(`/map?tour=storyline&${query}`);
    await expect(page).toHaveURL(/storylines$/);
  }
});

test('era filters lead to a shareable cross-era Scepter storyline', async ({ page }) => {
  await page.goto('/storylines');
  await expect(page.getByRole('heading', { name: 'All storylines' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Filter storylines by era' }).getByRole('link', { name: /Era 5/ }).click();
  await expect(page).toHaveURL(/storylines\?era=long-vigil-new-kingdoms/);
  await page.getByRole('link', { name: /The Scepter of the Shifting Sands/ }).click();
  await expect(page).toHaveURL(/storylines\/scepter-of-the-shifting-sands/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Scepter of the Shifting Sands' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The gates open' })).toBeVisible();
  await expect(page.getByRole('link', { name: /War of the Shifting Sands/ })).toHaveAttribute('href', 'https://worldofwarcraft.blizzard.com/en-us/media/short-story/war-of-the-shifting-sands');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'The Scepter of the Shifting Sands' })).toBeVisible();
});

test('storyline library and reading view fit phone, tablet, and desktop widths', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const path of ['/storylines', '/storylines/scepter-of-the-shifting-sands']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(horizontalOverflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
