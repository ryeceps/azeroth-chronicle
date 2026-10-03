import type { Page } from '@playwright/test';

// Human review contact sheets are separate from acceptance assertions. Keep them
// locally; CI can opt in when it will collect and review the output artifacts.
export const visualReviewEnabled = !process.env.CI || process.env.PLAYWRIGHT_VISUAL_REVIEW === '1';

export async function captureVisualReview(page: Page, options: NonNullable<Parameters<Page['screenshot']>[0]>): Promise<void> {
  if (visualReviewEnabled) await page.screenshot(options);
}
