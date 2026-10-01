import { expect, test } from '@playwright/test';

test('era entries keep storylines as independent readings and the full tour stays era-only', async ({ page }) => {
  await page.goto('/tours');
  await expect(page.getByRole('link', { name: /Classic to Wrath/ })).toBeVisible();
  await page.getByRole('link', { name: /Era 8.*Age of Adventurers/ }).click();
  await expect(page.getByRole('heading', { name: 'Connected storylines' })).toBeVisible();
  await expect(page.getByRole('link', { name: /The Scepter of the Shifting Sands/ })).toContainText('Playable tour');
  await page.getByRole('link', { name: /The Scepter of the Shifting Sands/ }).click();
  await expect(page.getByRole('link', { name: 'Experience this storyline' })).toBeVisible();
});

test('full-history playback continues between era chapters without entering storyline guides', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/map?era=age-of-adventurers&tour=full&node=adventurers-story-gates');
  await page.getByRole('button', { name: 'Pause tour' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/tour=full.*node=adventurers-story-outland/);
  await expect(page.getByRole('heading', { name: 'The road crosses into a broken world' })).toBeVisible();
  await expect(page).not.toHaveURL(/storyline=/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'The road crosses into a broken world' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The great powers call upon unnumbered hands' })).toBeVisible();
  await page.getByRole('button', { name: 'Leave tour' }).click();
  await expect(page).toHaveURL(/\/tours$/);
  expect(errors).toEqual([]);
});
