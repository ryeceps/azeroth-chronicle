import { expect, test } from '@playwright/test';

test('the storyline archive ends at Wrath while retaining ancient history', async ({ page }) => {
  await page.goto('/tours?view=storylines');
  await expect(page.getByText('27 stories', { exact: true })).toBeVisible();
  await expect(page.getByText(/archive covers ancient history through Wrath of the Lich King/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Galakrond and the Five Proto-Dragons/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Quel’Delar: The Broken Blade Restored/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dragonwrath|Suramar and the Nightwell|From Sunwell to Dawnwell/ })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Filter storylines by era' }).getByRole('link', { name: /Era 9/ }).click();
  await expect(page.locator('.storyline-card')).toHaveCount(0);
  await page.goto('/storylines/dragonwrath-blue-flight-succession');
  await expect(page.getByRole('heading', { name: 'Record not found' })).toBeVisible();
});

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
