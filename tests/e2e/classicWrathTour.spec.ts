import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

mkdirSync('output/akama-black-temple-visual-review', { recursive: true });
mkdirSync('output/quel-delar-visual-review', { recursive: true });
mkdirSync('output/defias-visual-review', { recursive: true });

test('story dots live on the map, expand on hover or focus, and open stories or previews', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/tours/classic-to-wrath');

  await expect(page.getByRole('heading', { name: 'Classic to Wrath' })).toBeVisible();
  const map = page.getByRole('img', { name: /original interpretive world atlas/i });
  await expect(map).toBeVisible();
  await expect.poll(() => map.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const viewport = page.viewportSize()!;
  const mapFrameBounds = await page.locator('.story-tour-map-frame').boundingBox();
  expect(mapFrameBounds).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });
  await expect(page.locator('.story-tour-dot')).toHaveCount(12);
  await expect(page.locator('.story-tour-placards')).toHaveCount(0);

  const onyxia = page.getByRole('button', { name: /stormwind-onyxia-conspiracy|Onyxia/i });
  const scepter = page.getByRole('button', { name: /scepter-of-the-shifting-sands|Scepter/i });
  const dungeonSetTwo = page.getByRole('button', { name: /dungeon-set-two-veiled-blade|Veiled Blade/i });
  const fallenHero = page.getByRole('button', { name: /fallen-hero-and-rakhlikh|Fallen Hero/i });
  const tirionTaelan = page.getByRole('button', { name: /tirion-taelan-of-love-and-family|Tirion and Taelan/i });
  const darrowshire = page.getByRole('button', { name: /darrowshire-lost-and-remembered|Darrowshire/i });
  const defias = page.getByRole('button', { name: /defias-original-conspiracy|Unsent Letter/i });
  const karazhan = page.getByRole('button', { name: /karazhan-masters-key-and-nightbane|Master’s Key and Nightbane/i });
  const akama = page.getByRole('button', { name: /akama-and-black-temple|Akama and the Black Temple/i });
  const outland = page.getByRole('button', { name: /cipher-of-damnation-oronok|Cipher/i });
  const northrend = page.getByRole('button', { name: /wrathgate-and-undercity|Wrathgate/i });
  const quelDelar = page.getByRole('button', { name: /quel-delar-restored|Broken Blade Restored/i });
  await expect(onyxia).toBeVisible();
  await expect(scepter).toBeVisible();
  await expect(dungeonSetTwo).toBeVisible();
  await expect(fallenHero).toBeVisible();
  await expect(tirionTaelan).toBeVisible();
  await expect(darrowshire).toBeVisible();
  await expect(defias).toBeVisible();
  await expect(karazhan).toBeVisible();
  await expect(akama).toBeVisible();
  await expect(outland).toBeVisible();
  await expect(northrend).toBeVisible();
  await expect(quelDelar).toBeVisible();

  await onyxia.hover();
  const onyxiaCard = page.locator('#story-tour-tip-stormwind-onyxia-conspiracy');
  await expect(onyxiaCard.getByRole('heading', { name: 'The Dragon in Stormwind' })).toBeVisible();
  await expect(onyxiaCard).toHaveCSS('opacity', '1');
  await expect(onyxiaCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/akama-black-temple-visual-review/classic-wrath-tour-desktop.png', fullPage: true });

  await outland.hover();
  const outlandCard = page.locator('#story-tour-tip-cipher-of-damnation-oronok');
  await expect(outlandCard.getByRole('heading', { name: /Cipher of Damnation/i })).toBeVisible();
  await expect(outlandCard).toContainText('Research preview');
  await expect(outlandCard.getByRole('button', { name: 'Play story' })).toHaveCount(0);
  await outlandCard.getByRole('link', { name: 'Read story preview' }).click();
  await expect(page.getByRole('heading', { name: 'Oronok and the Cipher of Damnation' })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await dungeonSetTwo.hover();
  const dungeonSetTwoCard = page.locator('#story-tour-tip-dungeon-set-two-veiled-blade');
  await expect(dungeonSetTwoCard.getByRole('heading', { name: 'The Veiled Blade and Lord Valthalak' })).toBeVisible();
  await expect(dungeonSetTwoCard).toContainText('Playable story');
  await dungeonSetTwo.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'dungeon-set-two-veiled-blade', 'story']);

  await page.goto('/tours/classic-to-wrath');
  await karazhan.hover();
  const karazhanCard = page.locator('#story-tour-tip-karazhan-masters-key-and-nightbane');
  await expect(karazhanCard.getByRole('heading', { name: 'Karazhan: The Master’s Key and Nightbane' })).toBeVisible();
  await expect(karazhanCard).toContainText('Playable story');
  await karazhan.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'karazhan-masters-key-and-nightbane', 'story']);

  await page.goto('/tours/classic-to-wrath');
  await fallenHero.hover();
  const fallenHeroCard = page.locator('#story-tour-tip-fallen-hero-and-rakhlikh');
  await expect(fallenHeroCard.getByRole('heading', { name: 'The Fallen Hero and Rakh’likh' })).toBeVisible();
  await expect(fallenHeroCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/fallen-hero-tour-desktop.png' });
  await fallenHero.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'fallen-hero-and-rakhlikh', 'story']);
  await expect(page.getByRole('heading', { name: 'Two roads to the Fallen Hero' })).toBeVisible();
  await expect(page.getByText(/separate faction paths/i)).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await tirionTaelan.hover();
  const tirionTaelanCard = page.locator('#story-tour-tip-tirion-taelan-of-love-and-family');
  await expect(tirionTaelanCard.getByRole('heading', { name: 'Tirion and Taelan: Of Love and Family' })).toBeVisible();
  await expect(tirionTaelanCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/tirion-taelan-tour-desktop.png' });
  await tirionTaelan.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'tirion-taelan-of-love-and-family', 'story']);
  await expect(page.getByRole('heading', { name: 'The old hermit by Thondroril' })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await darrowshire.hover();
  const darrowshireCard = page.locator('#story-tour-tip-darrowshire-lost-and-remembered');
  await expect(darrowshireCard.getByRole('heading', { name: 'Darrowshire: Lost and Remembered' })).toBeVisible();
  await expect(darrowshireCard).toContainText('Playable story');
  await darrowshire.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'darrowshire-lost-and-remembered', 'story']);
  await expect(page.getByRole('heading', { name: 'Flashback · Era 7 — The date the Annals give' })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await defias.hover();
  const defiasCard = page.locator('#story-tour-tip-defias-original-conspiracy');
  await expect(defiasCard.getByRole('heading', { name: 'The Defias and the Unsent Letter' })).toBeVisible();
  await expect(defiasCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/defias-visual-review/classic-wrath-tour-desktop.png', fullPage: true });
  await defias.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'defias-original-conspiracy', 'story']);
  await expect(page.getByRole('heading', { name: 'Farmers driven from Westfall' })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await akama.hover();
  const akamaCard = page.locator('#story-tour-tip-akama-and-black-temple');
  await expect(akamaCard.getByRole('heading', { name: 'Akama and the Black Temple' })).toBeVisible();
  await expect(akamaCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/akama-black-temple-visual-review/classic-wrath-tour-akama-hover.png', fullPage: true });
  await akama.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'akama-and-black-temple', 'story']);

  await page.goto('/tours/classic-to-wrath');
  await northrend.focus();
  const northrendCard = page.locator('#story-tour-tip-wrathgate-and-undercity');
  await expect(northrendCard.getByRole('heading', { name: 'The Wrathgate and Undercity' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play all stories' })).toBeEnabled();
  await northrend.evaluate((marker: HTMLButtonElement) => marker.blur());
  await quelDelar.hover();
  const quelDelarCard = page.locator('#story-tour-tip-quel-delar-restored');
  await expect(quelDelarCard.getByRole('heading', { name: 'Quel’Delar: The Broken Blade Restored' })).toBeVisible();
  await expect(quelDelarCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/quel-delar-visual-review/classic-wrath-tour-dot-desktop.png', fullPage: true });
  await quelDelar.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'quel-delar-restored', 'story']);
  await expect(page.getByRole('heading', { name: 'A hilt without a finder' })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await onyxia.hover();
  await onyxia.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'stormwind-onyxia-conspiracy', 'story']);
  expect(pageErrors).toEqual([]);
});

test('Play All advances completed stories in chronological order and restores the current chapter', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: 'Play all stories' }).click();
  await page.getByRole('button', { name: 'Pause tour' }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'stormwind-onyxia-conspiracy', 'all']);
  await expect(page.getByRole('heading', { name: 'A shadow over the Burning Steppes' })).toBeVisible();
  await page.screenshot({ path: 'output/akama-black-temple-visual-review/classic-wrath-tour-player-desktop.png', fullPage: true });

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=scepter-of-the-shifting-sands&node=scepter-story-timeless-treasure&play=all');
  await expect(page.getByRole('button', { name: 'Resume tour' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['dungeon-set-two-veiled-blade', 'dungeon-set-two-story-two-faction-doors', 'all']);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Two doors into the same story' })).toBeVisible();

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=dungeon-set-two-veiled-blade&node=dungeon-set-two-story-safe-for-now&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['fallen-hero-and-rakhlikh', 'fallen-hero-and-rakhlikh-story-two-roads-to-the-fallen-hero', 'all']);
  await expect(page.getByRole('heading', { name: 'Two roads to the Fallen Hero' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=fallen-hero-and-rakhlikh&node=fallen-hero-and-rakhlikh-story-horn-and-ward&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['tirion-taelan-of-love-and-family', 'tirion-taelan-of-love-and-family-story-the-old-hermit', 'all']);
  await expect(page.getByRole('heading', { name: 'The old hermit by Thondroril' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=tirion-taelan-of-love-and-family&node=tirion-taelan-of-love-and-family-story-a-new-order&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['darrowshire-lost-and-remembered', 'darrowshire-lost-and-remembered-story-annals-date-conflict', 'all']);
  await expect(page.getByRole('heading', { name: 'Flashback · Era 7 — The date the Annals give' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=darrowshire-lost-and-remembered&node=darrowshire-lost-and-remembered-story-family-homecoming&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['defias-original-conspiracy', 'defias-original-conspiracy-story-westfall-unrest', 'all']);
  await expect(page.getByRole('heading', { name: 'Farmers driven from Westfall' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=defias-original-conspiracy&node=defias-original-conspiracy-story-audience-unanswered&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['karazhan-masters-key-and-nightbane', 'karazhan-masters-key-and-nightbane-story-reports-from-deadwind', 'all']);
  await expect(page.getByRole('heading', { name: 'Reports from Deadwind Pass' })).toBeVisible();

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=karazhan-masters-key-and-nightbane&node=karazhan-masters-key-and-nightbane-story-nightbane-raised&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['akama-and-black-temple', 'akama-and-black-temple-story-karabor-under-illidan', 'all']);
  await expect(page.getByRole('heading', { name: 'Karabor under Illidan' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=akama-and-black-temple&node=akama-and-black-temple-story-fall-of-the-betrayer&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['quel-delar-restored', 'quel-delar-restored-story-battered-hilt-at-rest', 'all']);
  await expect(page.getByRole('heading', { name: 'A hilt without a finder' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=quel-delar-restored&node=quel-delar-restored-story-faction-handoffs&play=all');
  await page.getByRole('button', { name: 'Finish this story tour' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');
  expect(pageErrors).toEqual([]);
});

test('phone layout fits and touch opens a story card before playback', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => query === '(pointer: coarse)'
      ? ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList)
      : nativeMatchMedia(query);
  });
  await page.goto('/tours/classic-to-wrath');
  await expect(page.getByRole('heading', { name: 'Classic to Wrath' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  const mapFrameBounds = await page.locator('.story-tour-map-frame').boundingBox();
  expect(mapFrameBounds).toMatchObject({ x: 0, y: 0, width: 390, height: 844 });

  const phoneAkama = page.getByRole('button', { name: /akama-and-black-temple|Akama and the Black Temple/i });
  await phoneAkama.click();
  const phoneAkamaCard = page.locator('.story-tour-touch-card');
  await expect(phoneAkamaCard.getByRole('heading', { name: 'Akama and the Black Temple' })).toBeVisible();
  await page.screenshot({ path: 'output/akama-black-temple-visual-review/classic-wrath-tour-akama-phone.png', fullPage: true });

  const onyxia = page.getByRole('button', { name: /stormwind-onyxia-conspiracy|Onyxia/i });
  await onyxia.click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'The Dragon in Stormwind' })).toBeVisible();
  await page.screenshot({ path: 'output/akama-black-temple-visual-review/classic-wrath-tour-phone.png', fullPage: true });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
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
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /darrowshire-lost-and-remembered|Darrowshire/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'Darrowshire: Lost and Remembered' })).toBeVisible();
  await page.screenshot({ path: 'output/darrowshire-visual-review/classic-wrath-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Flashback · Era 7 — The date the Annals give' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /tirion-taelan-of-love-and-family|Tirion and Taelan/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'Tirion and Taelan: Of Love and Family' })).toBeVisible();
  await page.screenshot({ path: 'output/tirion-taelan-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The old hermit by Thondroril' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /fallen-hero-and-rakhlikh|Fallen Hero/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'The Fallen Hero and Rakh’likh' })).toBeVisible();
  await page.screenshot({ path: 'output/fallen-hero-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Two roads to the Fallen Hero' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /quel-delar-restored|Broken Blade Restored/i }).click();
  const phoneQuelDelarCard = page.locator('.story-tour-touch-card');
  await expect(phoneQuelDelarCard.getByRole('heading', { name: 'Quel’Delar: The Broken Blade Restored' })).toBeVisible();
  await expect(phoneQuelDelarCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/quel-delar-visual-review/classic-wrath-tour-phone.png' });
  await phoneQuelDelarCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A hilt without a finder' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /dungeon-set-two-veiled-blade|Veiled Blade/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'The Veiled Blade and Lord Valthalak' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /defias-original-conspiracy|Unsent Letter/i }).click();
  const phoneDefiasCard = page.locator('.story-tour-touch-card');
  await expect(phoneDefiasCard.getByRole('heading', { name: 'The Defias and the Unsent Letter' })).toBeVisible();
  await expect(phoneDefiasCard).toContainText('Playable story');
  await page.screenshot({ path: 'output/defias-visual-review/classic-wrath-tour-phone.png', fullPage: true });
  await phoneDefiasCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Farmers driven from Westfall' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=stormwind-onyxia-conspiracy&node=onyxia-story-onyxias-lair&play=story');
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=quel-delar-restored&node=quel-delar-restored-story-faction-handoffs&play=all');
  await page.getByRole('button', { name: 'Finish this story tour' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');
});
