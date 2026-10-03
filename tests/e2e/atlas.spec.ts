import { expect, test } from '@playwright/test';

test('legacy atlas links open the tour chooser instead of a free explorer', async ({ page }) => {
  await page.goto('/map?era=long-vigil-new-kingdoms&selected=entity:strom');
  await expect(page).toHaveURL(/\/tours\/eras\/long-vigil-new-kingdoms/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Long Vigil and the New Kingdoms' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tour this era' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore the atlas freely' })).toHaveCount(0);
});

test('a selected era opens a guided scene without atlas or dossier interaction', async ({ page }) => {
  await page.goto('/tours/eras/long-vigil-new-kingdoms');
  await page.getByRole('button', { name: 'Tour this era' }).click();
  await expect(page).toHaveURL(/era=long-vigil-new-kingdoms&tour=era/);
  await expect(page.getByRole('heading', { name: 'The broken world waits for new promises' })).toBeVisible();
  await expect(page.getByLabel('Guided historical scene')).toBeVisible();
  await expect(page.locator('.map-viewport canvas')).toHaveCSS('pointer-events', 'none');
  await expect(page.locator('.map-viewport button')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Selected atlas record' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Leave tour' })).toBeVisible();
});

test('Era 5 moves from Hyjal to Strom and the later kingdoms on the corrected terrain', async ({ page }) => {
  test.setTimeout(120_000);
  const terrain = page.waitForResponse((response) => response.url().endsWith('/rise-of-the-horde-post-sundering-map-research/terrain-atlas.research.webp'));
  await page.goto('/map?era=long-vigil-new-kingdoms&tour=era');
  expect((await terrain).status()).toBe(200);
  await expect(page.locator('.map-caption')).toContainText('INTERPRETIVE EARLY POST-SUNDERING STATE');
  for (let chapter = 0; chapter < 7; chapter += 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Scattered tribes answer one human king' })).toBeVisible();
  await expect(page.locator('.map-caption')).toContainText('INTERPRETIVE MIGRATION AND FOUNDING STATE');
  await expect(page.locator('.map-label').filter({ hasText: 'Strom' })).toBeVisible();
  await expect(page.locator('.map-viewport button')).toHaveCount(0);
  for (let chapter = 0; chapter < 3; chapter += 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One human empire becomes seven kingdoms' })).toBeVisible();
  await expect(page.locator('.map-caption')).toContainText('INTERPRETIVE LATE KINGDOM STATE');
});

test('a single-era tour finishes at the chooser without continuing into another era', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/map?era=cosmic-origins&tour=era');
  for (let chapter = 0; chapter < 8; chapter += 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One world among the stars' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish this era' }).click();
  await expect(page).toHaveURL(/\/\?tour=era-complete&era=cosmic-origins/);
  await expect(page.getByText('That era’s story is complete.')).toBeVisible();
});
