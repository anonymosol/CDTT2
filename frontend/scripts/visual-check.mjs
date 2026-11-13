import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = new URL('../../docs/screenshots/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', (error) => errors.push(error.message));
for (const [path, name] of [
  ['/games', 'discovery'],
  ['/recommend', 'recommend'],
  ['/library', 'library'],
  ['/login', 'login'],
  ['/onboarding', 'onboarding'],
  ['/games/dao-may', 'detail'],
]) {
  await page.goto(`http://127.0.0.1:5173${path}`);
  await page.getByRole('main').waitFor();
  if (path === '/games') await page.getByTestId('game-card').first().waitFor();
  if (path === '/games/dao-may')
    await page.getByRole('heading', { name: 'Đảo Mây', exact: true }).waitFor();
  if (path === '/onboarding')
    await page.getByRole('button', { name: 'Mình từng chơi' }).first().waitFor();
  await page.screenshot({
    path: fileURLToPath(new URL(`${name}-desktop.png`, output)),
    fullPage: true,
  });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth))
      throw new Error(`Horizontal overflow on ${path} at ${width}`);
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:5173/games');
await page.getByTestId('game-card').first().waitFor();
await page.screenshot({
  path: fileURLToPath(new URL('discovery-mobile.png', output)),
  fullPage: true,
});
await page.getByRole('button', { name: 'Mở menu' }).click();
await page
  .getByRole('navigation', { name: 'Điều hướng chính' })
  .getByRole('link', { name: 'Gợi ý cho bạn' })
  .click();
await page.getByRole('heading', { name: 'Kể mình nghe, bạn muốn chơi gì?' }).waitFor();
await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
console.log(
  'Visual check: 6 routes × 4 widths, mobile menu, zero page errors. Screenshots in docs/screenshots.',
);
