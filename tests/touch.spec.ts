import { expect, test } from '@playwright/test';

test('touch cancellation and a second finger cannot cause a stray launch', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  const ring = await page.locator('#gesture-guide').boundingBox();
  const x = ring!.x + ring!.width / 2, y = ring!.y + ring!.height / 2;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 61, y, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 61, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 61, y, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 61, y, id: 1 }, { x: x - 61, y, id: 2 }] });
  // A third contact must not restart the gesture while the first two are held.
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 61, y, id: 1 }, { x: x - 61, y, id: 2 }, { x: x + 59, y: y + 2, id: 3 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x: x + 59, y: y + 2, id: 3 }] });
  for (let i = 1; i <= 16; i++) {
    const angle = i / 16 * Math.PI * 1.2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + Math.cos(angle) * 61, y: y + Math.sin(angle) * 61, id: 3 }] });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'ready');
  await expect(page.locator('#timer')).toHaveText('00.0s');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 61, y, id: 1 }] });
  for (let i = 1; i <= 20; i++) {
    const angle = i / 20 * Math.PI * 1.2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + Math.cos(angle) * 61, y: y + Math.sin(angle) * 61, id: 1 }] });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#app')).toHaveAttribute('data-phase', 'spinning');
});
