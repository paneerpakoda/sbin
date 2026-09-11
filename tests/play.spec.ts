import { expect, test } from '@playwright/test';

test('guided launch, pause, result, pencil box and persistent best', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('./');
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  await expect(page.getByRole('heading', { name: 'Give it a little spin.' })).toBeVisible();
  await expect(page.locator('#gesture-guide')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('ready.png'), fullPage: true });
  await page.getByRole('button', { name: 'Show me a spin' }).click();
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'spinning');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Pause spin' }).click();
  const pausedAt = await page.locator('#timer').innerText();
  await page.waitForTimeout(300);
  expect(await page.locator('#timer').innerText()).toBe(pausedAt);
  await page.screenshot({ path: testInfo.outputPath('paused.png'), fullPage: true });
  await page.getByRole('button', { name: 'Keep spinning' }).click();
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'stopped', { timeout: 35_000 });
  await expect(page.locator('#best')).not.toHaveText('—');
  await page.screenshot({ path: testInfo.outputPath('result.png'), fullPage: true });
  const best = await page.locator('#best').innerText();
  await page.getByRole('button', { name: 'Your pencil box' }).click();
  await page.getByRole('button', { name: 'Off-centre' }).click();
  await page.getByRole('button', { name: 'That little dent' }).click();
  await page.screenshot({ path: testInfo.outputPath('pencil-box.png'), fullPage: true });
  await page.getByRole('button', { name: 'Back to the desk' }).click();
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  await page.reload();
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  await expect(page.locator('#best')).toHaveText(best);
  expect(errors).toEqual([]);
});

test('a real pointer arc launches the eraser', async ({ page }, testInfo) => {
  await page.goto('./');
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  const ring = await page.locator('#gesture-guide').boundingBox();
  expect(ring).not.toBeNull();
  const cx = ring!.x + ring!.width / 2, cy = ring!.y + ring!.height / 2;
  await page.mouse.move(cx + 61, cy);
  await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    const angle = (i / 24) * Math.PI * 1.2;
    await page.mouse.move(cx + Math.cos(angle) * 61, cy + Math.sin(angle) * 61);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'spinning');
  await expect(page.locator('#feedback')).toHaveText('That was a smooth release.');
  await page.screenshot({ path: testInfo.outputPath('gesture-launch.png'), fullPage: true });
});
