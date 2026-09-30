import { expect, test } from '@playwright/test';

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
