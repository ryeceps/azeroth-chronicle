import { expect, test } from '@playwright/test';

test('Classic to Wrath map filters continents and keeps research placards out of playback', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/tours/classic-to-wrath');

  await expect(page.getByRole('heading', { name: 'Classic to Wrath' })).toBeVisible();
  const map = page.getByRole('img', { name: /original interpretive world atlas/i });
  await expect(map).toBeVisible();
  await expect.poll(() => map.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /Kalimdor/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Eastern Kingdoms/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Northrend/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Outland/i })).toBeVisible();
  await page.screenshot({ path: 'output/classic-wrath-tour-desktop.png', fullPage: true });

  await page.getByRole('button', { name: /Outland/i }).click();
  await expect(page.getByRole('heading', { name: 'Stories from Outland' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oronok and the Cipher of Damnation' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play story' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Read story preview' }).click();
  await expect(page.getByRole('heading', { name: 'Oronok and the Cipher of Damnation' })).toBeVisible();
  await page.getByRole('link', { name: 'Classic to Wrath', exact: true }).click();

  await page.getByRole('button', { name: /Northrend/i }).click();
  await expect(page.getByRole('heading', { name: 'Stories from Northrend' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Wrathgate and Undercity' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play story' })).toHaveCount(0);
  await page.getByRole('button', { name: 'All stories' }).click();
  await expect(page.getByRole('heading', { name: 'Stories across the expansions' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play all chronologically' })).toBeEnabled();
  expect(pageErrors).toEqual([]);
});

test('Play all advances across completed guides and refresh keeps the current story-tour chapter', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: 'Play all chronologically' }).click();
  await page.getByRole('button', { name: 'Pause tour' }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'stormwind-onyxia-conspiracy', 'all']);
  await expect(page.getByRole('heading', { name: 'A shadow over the Burning Steppes' })).toBeVisible();
  await page.screenshot({ path: 'output/classic-wrath-tour-player-desktop.png', fullPage: true });

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=stormwind-onyxia-conspiracy&node=onyxia-story-onyxias-lair&play=all');
  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['scepter-of-the-shifting-sands', 'scepter-story-the-first-war', 'all']);
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['stormwind-onyxia-conspiracy', 'onyxia-story-onyxias-lair', 'all']);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Into the dragon’s lair' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('compact StoryTour layout fits the viewport and returns from individual playback', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tours/classic-to-wrath');
  await expect(page.getByRole('heading', { name: 'Classic to Wrath' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  await page.screenshot({ path: 'output/classic-wrath-tour-phone.png', fullPage: true });

  await page.getByRole('button', { name: /Kalimdor/i }).click();
  await page.getByRole('button', { name: 'Play story' }).first().click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'stormwind-onyxia-conspiracy', 'story']);
  await expect(page.getByRole('button', { name: 'Pause tour' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('node'), params.get('play')];
  }).toEqual(['onyxia-story-true-masters', 'story']);
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=stormwind-onyxia-conspiracy&node=onyxia-story-onyxias-lair&play=story');
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');
});
