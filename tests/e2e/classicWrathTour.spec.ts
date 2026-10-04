import { captureVisualReview } from './helpers/visualReview';
import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

mkdirSync('output/akama-black-temple-visual-review', { recursive: true });
mkdirSync('output/quel-delar-visual-review', { recursive: true });
mkdirSync('output/defias-visual-review', { recursive: true });
mkdirSync('output/cipher-visual-review', { recursive: true });
mkdirSync('output/ras-frostwhisper-visual-review', { recursive: true });

test('story dots live on the map, expand on hover or focus, and open stories or previews', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/tours/classic-to-wrath');

  await expect(page.getByRole('heading', { name: 'Classic to Wrath' })).toBeVisible();
  const map = page.getByRole('img', { name: /original interpretive world atlas/i });
  await expect(map).toBeVisible();
  await expect.poll(() => map.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const viewport = page.viewportSize()!;
  const controlBounds = await page.locator('.story-tour-controls').boundingBox();
  const mapFrameBounds = await page.locator('.story-tour-map-frame').boundingBox();
  expect(mapFrameBounds).toMatchObject({ x: 0, width: viewport.width });
  expect(mapFrameBounds!.y).toBe(0);
  expect(controlBounds!.y).toBe(0);
  expect(mapFrameBounds!.y + mapFrameBounds!.height).toBe(viewport.height);
  await expect(page.locator('.story-tour-dot')).toHaveCount(23);
  await expect(page.locator('.story-tour-placards')).toHaveCount(0);
  await expect(page.locator('.story-tour-backdrop, .story-tour-section-heading, .story-tour-map-caption, .story-tour-order-note')).toHaveCount(0);
  await expect(page.locator('.story-tour-tooltip').first()).toHaveCSS('visibility', 'hidden');

  const onyxia = page.getByRole('button', { name: /stormwind-onyxia-conspiracy|Onyxia/i });
  const scepter = page.locator('.story-tour-dot[aria-describedby="story-tour-tip-scepter-of-the-shifting-sands"]');
  const dungeonSetTwo = page.getByRole('button', { name: /dungeon-set-two-veiled-blade|Veiled Blade/i });
  const fallenHero = page.getByRole('button', { name: /fallen-hero-and-rakhlikh|Fallen Hero/i });
  const tirionTaelan = page.getByRole('button', { name: /tirion-taelan-of-love-and-family|Tirion and Taelan/i });
  const darrowshire = page.getByRole('button', { name: /darrowshire-lost-and-remembered|Darrowshire/i });
  const defias = page.getByRole('button', { name: /defias-original-conspiracy|Unsent Letter/i });
  const scythe = page.getByRole('button', { name: /scythe-of-elune-original-mystery|Scythe of Elune/i });
  const yehkinya = page.getByRole('button', { name: /yehkinya-and-hakkars-return|Yeh'kinya/i });
  const ras = page.getByRole('button', { name: /ras-frostwhisper-and-the-soulbound-keepsake|Ras Frostwhisper/i });
  const karazhan = page.getByRole('button', { name: /karazhan-masters-key-and-nightbane|Master’s Key and Nightbane/i });
  const consortiumArcatraz = page.getByRole('button', { name: /consortium-and-arcatraz|Consortium and the Arcatraz/i });
  const maghar = page.getByRole('button', { name: /hero-of-the-maghar|Hero of the Mag'har/i });
  const akama = page.getByRole('button', { name: /akama-and-black-temple|Akama and the Black Temple/i });
  const outland = page.getByRole('button', { name: /The Cipher of Damnation: Oronok/i });
  const championOfTheNaaru = page.getByRole('button', { name: /champion-of-the-naaru-outland-trials|Champion of the Naaru/i });
  const netherwing = page.getByRole('button', { name: /netherwing-liberation|Netherwing/i });
  const swiftFlight = page.getByRole('button', { name: /swift-flight-form-raven-legacy|Swift Flight Form/i });
  const missingDiplomat = page.getByRole('button', { name: /missing-diplomat-original-investigation|The Missing Diplomat/i });
  const shatteredSun = page.getByRole('button', { name: /shattered-sun-and-sunwell|Shattered Sun and the restored Sunwell/i });
  const northrend = page.getByRole('button', { name: /wrathgate-and-undercity|Wrathgate/i });
  const quelDelar = page.getByRole('button', { name: /quel-delar-restored|Broken Blade Restored/i });
  await expect(onyxia).toBeVisible();
  await expect(scepter).toBeVisible();
  await expect(dungeonSetTwo).toBeVisible();
  await expect(fallenHero).toBeVisible();
  await expect(tirionTaelan).toBeVisible();
  await expect(darrowshire).toBeVisible();
  await expect(defias).toBeVisible();
  await expect(scythe).toBeVisible();
  await expect(yehkinya).toBeVisible();
  await expect(ras).toBeVisible();
  await expect(karazhan).toBeVisible();
  await expect(consortiumArcatraz).toBeVisible();
  await expect(maghar).toBeVisible();
  await expect(akama).toBeVisible();
  await expect(outland).toBeVisible();
  await expect(championOfTheNaaru).toBeVisible();
  await expect(netherwing).toBeVisible();
  await expect(swiftFlight).toBeVisible();
  await expect(missingDiplomat).toBeVisible();
  await expect(shatteredSun).toBeVisible();
  await expect(northrend).toBeVisible();
  await expect(quelDelar).toBeVisible();

  await onyxia.hover();
  const onyxiaCard = page.locator('#story-tour-tip-stormwind-onyxia-conspiracy');
  await expect(onyxiaCard.getByRole('heading', { name: 'The Dragon in Stormwind' })).toBeVisible();
  await expect(onyxiaCard).toHaveCSS('opacity', '1');
  await expect(onyxiaCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/akama-black-temple-visual-review/classic-wrath-tour-desktop.png', fullPage: true });

  await page.goto('/tours/classic-to-wrath');
  await expect(onyxiaCard).toHaveCSS('visibility', 'hidden');
  await ras.hover();
  const rasCard = page.locator('#story-tour-tip-ras-frostwhisper-and-the-soulbound-keepsake');
  await expect(rasCard.getByRole('heading', { name: 'Ras Frostwhisper: a lich’s mortality' })).toBeVisible();
  await expect(rasCard).toContainText('Playable story');
  await expect(page.locator('.story-tour-tooltip:visible')).toHaveCount(1);
  await expect(onyxiaCard).toHaveCSS('opacity', '0');
  await page.screenshot({ path: 'output/ras-frostwhisper-visual-review/classic-wrath-map-ras-hover.png', fullPage: true, animations: 'disabled' });
  await rasCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page).toHaveURL(/storyline=ras-frostwhisper-and-the-soulbound-keepsake/);
  await expect(page.getByRole('heading', { name: 'An unseen magistrate', exact: true })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');

  await outland.hover();
  const outlandCard = page.locator('#story-tour-tip-cipher-of-damnation-oronok');
  await expect(outlandCard.getByRole('heading', { name: /Cipher of Damnation/i })).toBeVisible();
  await expect(outlandCard).toContainText('Playable story');
  await outlandCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The Hand of Gul’dan' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/cipher-visual-review/storytour-desktop.png', fullPage: true });

  await page.goto('/tours/classic-to-wrath');
  await championOfTheNaaru.hover();
  const championCard = page.locator('#story-tour-tip-champion-of-the-naaru-outland-trials');
  await expect(championCard.getByRole('heading', { name: 'Champion of the Naaru: Trials across Outland' })).toBeVisible();
  await expect(championCard).toContainText('Playable story');
  await championCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A letter after the Cipher', exact: true })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await missingDiplomat.hover();
  const missingDiplomatCard = page.locator('#story-tour-tip-missing-diplomat-original-investigation');
  await expect(missingDiplomatCard.getByRole('heading', { name: 'The Missing Diplomat: From Stormwind to Alcaz' })).toBeVisible();
  await expect(missingDiplomatCard).toContainText('Playable story');
  await missingDiplomatCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A quiet summons' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/missing-diplomat-visual-review/storytour-desktop.png', fullPage: true });

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
  await consortiumArcatraz.hover();
  const consortiumArcatrazCard = page.locator('#story-tour-tip-consortium-and-arcatraz');
  await expect(consortiumArcatrazCard.getByRole('heading', { name: 'The Consortium and the Arcatraz prison' })).toBeVisible();
  await expect(consortiumArcatrazCard).toContainText('Playable story');
  await consortiumArcatrazCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The crystal that is not the answer', exact: true })).toBeVisible();

  await page.goto('/tours/classic-to-wrath');
  await yehkinya.hover();
  const yehkinyaCard = page.locator('#story-tour-tip-yehkinya-and-hakkars-return');
  await expect(yehkinyaCard.getByRole('heading', { name: "Yeh'kinya, the Ancient Egg, and Hakkar" })).toBeVisible();
  await expect(yehkinyaCard).toContainText('Playable story');
  await yehkinyaCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A request at the port' })).toBeVisible();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'yehkinya-and-hakkars-return', 'story']);

  await page.goto('/tours/classic-to-wrath');
  await fallenHero.hover();
  const fallenHeroCard = page.locator('#story-tour-tip-fallen-hero-and-rakhlikh');
  await expect(fallenHeroCard.getByRole('heading', { name: 'The Fallen Hero and Rakh’likh' })).toBeVisible();
  await expect(fallenHeroCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/fallen-hero-tour-desktop.png' });
  await fallenHero.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'fallen-hero-and-rakhlikh', 'story']);
  await expect(page.getByRole('heading', { name: 'Two roads to the Fallen Hero' })).toBeVisible();
  await expect(page.getByLabel('Chapter transcript')).toContainText('Different appeals brought the living to his spirit');

  await page.goto('/tours/classic-to-wrath');
  await tirionTaelan.hover();
  const tirionTaelanCard = page.locator('#story-tour-tip-tirion-taelan-of-love-and-family');
  await expect(tirionTaelanCard.getByRole('heading', { name: 'Tirion and Taelan: Of Love and Family' })).toBeVisible();
  await expect(tirionTaelanCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/tirion-taelan-tour-desktop.png' });
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
  await captureVisualReview(page, { path: 'output/defias-visual-review/classic-wrath-tour-desktop.png', fullPage: true });
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
  await captureVisualReview(page, { path: 'output/akama-black-temple-visual-review/classic-wrath-tour-akama-hover.png', fullPage: true });
  await akama.click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('tour'), params.get('collection'), params.get('storyline'), params.get('play')];
  }).toEqual(['story-tour', 'classic-to-wrath', 'akama-and-black-temple', 'story']);

  await page.goto('/tours/classic-to-wrath');
  await northrend.focus();
  const northrendCard = page.locator('#story-tour-tip-wrathgate-and-undercity');
  await expect(northrendCard.getByRole('heading', { name: 'The Wrathgate and Undercity' })).toBeVisible();
  await expect(northrendCard).toContainText('Playable story');
  await expect(page.getByRole('button', { name: 'Play all stories' })).toBeEnabled();
  await northrendCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A winter road for the Alliance', exact: true })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await northrend.evaluate((marker: HTMLButtonElement) => marker.blur());
  await shatteredSun.hover();
  const shatteredSunCard = page.locator('#story-tour-tip-shattered-sun-and-sunwell');
  await expect(shatteredSunCard.getByRole('heading', { name: 'The Shattered Sun and the restored Sunwell' })).toBeVisible();
  await expect(shatteredSunCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/classic-wrath-tour-desktop.png', fullPage: true });
  await quelDelar.hover();
  const quelDelarCard = page.locator('#story-tour-tip-quel-delar-restored');
  await expect(quelDelarCard.getByRole('heading', { name: 'Quel’Delar: The Broken Blade Restored' })).toBeVisible();
  await expect(quelDelarCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/quel-delar-visual-review/classic-wrath-tour-dot-desktop.png', fullPage: true });
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
  await captureVisualReview(page, { path: 'output/akama-black-temple-visual-review/classic-wrath-tour-player-desktop.png', fullPage: true });

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
  }).toEqual(['scythe-of-elune-original-mystery', 'scythe-of-elune-original-mystery-the-wolf-men-of-howling-vale', 'all']);
  await expect(page.getByRole('heading', { name: 'The wolf-men of the Howling Vale' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=scythe-of-elune-original-mystery&node=scythe-of-elune-original-mystery-jitters-book-from-svens-farm&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['yehkinya-and-hakkars-return', 'yehkinya-and-hakkars-return-a-request-at-the-port', 'all']);
  await expect(page.getByRole('heading', { name: 'A request at the port' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=yehkinya-and-hakkars-return&node=yehkinya-and-hakkars-return-hakkar-banished&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['ras-frostwhisper-and-the-soulbound-keepsake', 'ras-frostwhisper-and-the-soulbound-keepsake-story-an-unseen-magistrate', 'all']);
  await expect(page.getByRole('heading', { name: 'An unseen magistrate' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=ras-frostwhisper-and-the-soulbound-keepsake&node=ras-frostwhisper-and-the-soulbound-keepsake-story-mardukes-accounting&play=all');
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
  }).toEqual(['consortium-and-arcatraz', 'consortium-and-arcatraz-story-the-arklon-crystal', 'all']);
  await expect(page.getByRole('heading', { name: 'The crystal that is not the answer' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=consortium-and-arcatraz&node=consortium-and-arcatraz-story-skyriss-contained&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('storyline'), params.get('node'), params.get('play')];
  }).toEqual(['hero-of-the-maghar', 'hero-of-the-maghar-story-garadar-burden', 'all']);
  await expect(page.getByRole('heading', { name: 'Garadar beneath the Hellscream name' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=hero-of-the-maghar&node=hero-of-the-maghar-story-garrosh-name-restored&play=all');
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
  }).toEqual(['cipher-of-damnation-oronok', 'cipher-of-damnation-oronok-story-hand-of-guldan', 'all']);
  await expect(page.getByRole('heading', { name: 'The Hand of Gul’dan' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=cipher-of-damnation-oronok&node=cipher-of-damnation-oronok-story-the-mark-of-kaelthas&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A letter after the Cipher' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('champion-of-the-naaru-outland-trials');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=champion-of-the-naaru-outland-trials&node=champion-of-the-naaru-outland-trials-story-the-title-and-the-separate-gate&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A kindness in the fields' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('netherwing-liberation');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=netherwing-liberation&node=netherwing-liberation-story-barthamus-offer&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A calling at Cenarion Refuge' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('swift-flight-form-raven-legacy');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=swift-flight-form-raven-legacy&node=swift-flight-form-raven-legacy-story-eternal-vigilance&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A quiet summons' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('missing-diplomat-original-investigation');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=missing-diplomat-original-investigation&node=missing-diplomat-original-investigation-story-return-to-jaina&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A fount for a new home', exact: true })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('shattered-sun-and-sunwell');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=shattered-sun-and-sunwell&node=shattered-sun-and-sunwell-story-murus-heart-renews-the-sunwell&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A winter road for the Alliance', exact: true })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('wrathgate-and-undercity');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=wrathgate-and-undercity&node=wrathgate-and-undercity-story-the-war-continues&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A captive among the cedars' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('drakuru-betrayal');
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=drakuru-betrayal&node=drakuru-betrayal-story-the-lich-kings-judgment&play=all');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A hilt without a finder' })).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get('storyline')).toBe('quel-delar-restored');
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
  const controlBounds = await page.locator('.story-tour-controls').boundingBox();
  const mapFrameBounds = await page.locator('.story-tour-map-frame').boundingBox();
  expect(mapFrameBounds).toMatchObject({ x: 0, width: 390 });
  expect(mapFrameBounds!.y).toBe(0);
  expect(controlBounds!.y).toBe(0);
  expect(mapFrameBounds!.y + mapFrameBounds!.height).toBe(844);

  const phoneAkama = page.getByRole('button', { name: /akama-and-black-temple|Akama and the Black Temple/i });
  await phoneAkama.click();
  const phoneAkamaCard = page.locator('.story-tour-touch-card');
  await expect(phoneAkamaCard.getByRole('heading', { name: 'Akama and the Black Temple' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/akama-black-temple-visual-review/classic-wrath-tour-akama-phone.png', fullPage: true });
  await phoneAkamaCard.getByRole('button', { name: 'Close story preview' }).click();
  await expect(phoneAkamaCard).toHaveCount(0);
  await page.mouse.move(5, 5);

  const onyxia = page.getByRole('button', { name: /stormwind-onyxia-conspiracy|Onyxia/i });
  await onyxia.click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'The Dragon in Stormwind' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/akama-black-temple-visual-review/classic-wrath-tour-phone.png', fullPage: true });
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
  const phoneShatteredSun = page.getByRole('button', { name: /shattered-sun-and-sunwell|Shattered Sun and the restored Sunwell/i });
  await phoneShatteredSun.click();
  const phoneShatteredSunCard = page.locator('.story-tour-touch-card');
  await expect(phoneShatteredSunCard.getByRole('heading', { name: 'The Shattered Sun and the restored Sunwell' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/shattered-sun-sunwell-visual-review/classic-wrath-tour-phone.png', fullPage: true });
  await phoneShatteredSunCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'A fount for a new home', exact: true })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /darrowshire-lost-and-remembered|Darrowshire/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'Darrowshire: Lost and Remembered' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/darrowshire-visual-review/classic-wrath-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Flashback · Era 7 — The date the Annals give' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /tirion-taelan-of-love-and-family|Tirion and Taelan/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'Tirion and Taelan: Of Love and Family' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/tirion-taelan-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The old hermit by Thondroril' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /fallen-hero-and-rakhlikh|Fallen Hero/i }).click();
  await expect(page.locator('.story-tour-touch-card').getByRole('heading', { name: 'The Fallen Hero and Rakh’likh' })).toBeVisible();
  await captureVisualReview(page, { path: 'output/fallen-hero-tour-phone.png' });
  await page.locator('.story-tour-touch-card').getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Two roads to the Fallen Hero' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /quel-delar-restored|Broken Blade Restored/i }).click();
  const phoneQuelDelarCard = page.locator('.story-tour-touch-card');
  await expect(phoneQuelDelarCard.getByRole('heading', { name: 'Quel’Delar: The Broken Blade Restored' })).toBeVisible();
  await expect(phoneQuelDelarCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/quel-delar-visual-review/classic-wrath-tour-phone.png' });
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
  await captureVisualReview(page, { path: 'output/defias-visual-review/classic-wrath-tour-phone.png', fullPage: true });
  await phoneDefiasCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'Farmers driven from Westfall' })).toBeVisible();
  await page.goto('/tours/classic-to-wrath');
  await page.getByRole('button', { name: /The Cipher of Damnation: Oronok/i }).click();
  const phoneCipherCard = page.locator('.story-tour-touch-card');
  await expect(phoneCipherCard.getByRole('heading', { name: /Cipher of Damnation/i })).toBeVisible();
  await expect(phoneCipherCard).toContainText('Playable story');
  await captureVisualReview(page, { path: 'output/cipher-visual-review/storytour-phone.png', fullPage: true });
  await phoneCipherCard.getByRole('button', { name: 'Play story' }).click();
  await expect(page.getByRole('heading', { name: 'The Hand of Gul’dan' })).toBeVisible();
  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=stormwind-onyxia-conspiracy&node=onyxia-story-onyxias-lair&play=story');
  await page.getByRole('button', { name: 'Finish this storyline' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');

  await page.goto('/map?era=age-of-adventurers&tour=story-tour&collection=classic-to-wrath&storyline=quel-delar-restored&node=quel-delar-restored-story-faction-handoffs&play=all');
  await page.getByRole('button', { name: 'Finish this story tour' }).click();
  await expect(page).toHaveURL(/\/tours\/classic-to-wrath\?complete=1/);
  await expect(page.getByRole('status')).toContainText('chronicle is complete');
});
