import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const scepter = JSON.parse(readFileSync('data/stories/scepter-of-the-shifting-sands.research.json', 'utf8')) as { guide: { nodeIds: string[] }; nodes: { title: string }[] };

test('era entry presents connected story offshoots and distinct tour routes', async ({ page }) => {
  await page.goto('/tours');
  await page.getByRole('link', { name: /Era 8.*Age of Adventurers/ }).click();
  await expect(page.getByRole('heading', { name: 'Connected storylines' })).toBeVisible();
  await expect(page.getByRole('link', { name: /The Scepter of the Shifting Sands/ })).toContainText('Playable tour');
  await page.screenshot({ path: 'output/tour-library-era.png', fullPage: true });
  await page.getByRole('link', { name: /The Scepter of the Shifting Sands/ }).click();
  await expect(page.getByRole('link', { name: 'Experience this storyline' })).toBeVisible();
});

test('full tour enters Scepter, refreshes, returns to Outland and traverses backwards while paused', async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/map?era=age-of-adventurers&tour=full&node=adventurers-story-gates');
  await page.getByRole('button', { name: 'Pause tour' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/storyline=scepter-of-the-shifting-sands/);
  await expect(page.getByRole('heading', { name: scepter.nodes[0]!.title })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('heading', { name: 'The great powers call upon unnumbered hands' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: scepter.nodes[1]!.title })).toBeVisible();
  await expect(page.locator('.map-caption')).toContainText('ILLUSTRATED QUESTLINE THEATER');
  for (let i = 1; i < scepter.nodes.length; i++) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).not.toHaveURL(/storyline=/);
  await expect(page.getByRole('heading', { name: 'The road crosses into a broken world' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible();
  await expect(page.locator('.story-atmosphere img')).not.toHaveAttribute('src', /scepter/);
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('heading', { name: scepter.nodes.at(-1)!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/\/tours$/);
  expect(errors).toEqual([]);
});

test('silent autoplay crosses the storyline boundary and audio returns to the era', async ({ page }) => {
  await page.clock.install();
  await page.goto('/map?era=age-of-adventurers&tour=full&node=adventurers-story-gates');
  await expect(page.getByRole('heading', { name: 'The great powers call upon unnumbered hands' })).toBeVisible();
  await page.clock.fastForward(70_100);
  await expect(page.getByRole('heading', { name: scepter.nodes[0]!.title })).toBeVisible();
  await page.goto(`/map?era=age-of-adventurers&tour=full&node=${scepter.guide.nodeIds.at(-1)}&storyline=scepter-of-the-shifting-sands`);
  await expect(page.getByRole('heading', { name: scepter.nodes.at(-1)!.title })).toBeVisible();
  await page.getByRole('button', { name: 'Resume tour' }).click();
  await page.getByRole('button', { name: 'Enable voice-over' }).click();
  await page.clock.resume();
  await expect.poll(() => page.locator('audio').evaluate((audio: HTMLAudioElement) => !audio.paused && Number.isFinite(audio.duration))).toBe(true);
  await page.locator('audio').evaluate((audio: HTMLAudioElement) => { audio.currentTime = audio.duration - 0.1; });
  await expect(page.getByRole('heading', { name: 'The road crosses into a broken world' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Voice-over on' })).toHaveAttribute('aria-pressed', 'true');
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`quiet entry and library at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Every age leaves a story.' })).toBeVisible();
    await expect(page.getByRole('combobox')).toHaveCount(0);
    await page.screenshot({ path: `output/minimal-home-${viewport.width}.png`, fullPage: true });
    await page.getByRole('link', { name: /Explore tours/ }).click();
    await expect(page.getByRole('navigation', { name: 'Tour sections' })).toBeVisible();
    await page.screenshot({ path: `output/tour-library-${viewport.width}.png`, fullPage: true });
    await page.getByRole('link', { name: 'Storylines', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'All storylines' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
