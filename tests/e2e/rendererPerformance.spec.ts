import { expect, test } from '@playwright/test';

test('representative guided renderer stays inside the Phase 0 scene budgets', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/map?era=black-empire&tour=era&profile=1');
  const output = page.getByTestId('performance-report');
  await expect(output).not.toHaveText('Sampling renderer…', { timeout: 75_000 });
  const report = JSON.parse(await output.textContent() ?? '{}') as {
    renderer: string;
    medianFrameMs: number;
    p95FrameMs: number;
    drawCalls: number;
    sampleFrames: number;
    usefulSceneMs: number;
  };
  test.info().annotations.push({ type: 'renderer-metrics', description: JSON.stringify(report) });
  expect(report.sampleFrames).toBe(90);
  if (!report.renderer.toLocaleLowerCase().includes('swiftshader')) {
    expect(report.medianFrameMs).toBeLessThanOrEqual(16.7);
    expect(report.p95FrameMs).toBeLessThanOrEqual(25);
  }
  expect(report.drawCalls).toBeLessThanOrEqual(25);
  expect(report.usefulSceneMs).toBeLessThanOrEqual(2500);
});
