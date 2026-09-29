import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`Era 9 reaches released Midnight chapters at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/map?era=modern-cosmic-age&tour=era');
    await expect(page.getByRole('heading', { name: 'The wounded inherit another war' })).toBeVisible();
    await page.getByRole('button', { name: 'Pause tour' }).click();
    for (let chapter = 0; chapter < 8; chapter += 1) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: 'Beyond Azeroth, a shattered world' })).toBeVisible();
    await expect(page.locator('audio')).toHaveAttribute('src', /modern-story-karesh\.mp3$/);
    for (const heading of [
      'The first shadow over Quel’Thalas',
      'The Sunwell falls into shadow',
      'A new light from old wounds',
      'The curse beyond Zul’Aman',
    ]) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(page.getByLabel('Chapter transcript')).toContainText('wider Worldsoul Saga remains unfinished');
    await expect(page.locator('audio')).toHaveAttribute('src', /modern-story-coiled-isle\.mp3$/);
    expect(errors).toEqual([]);
  });
}
