import { chromium } from 'playwright';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4173/games');
  if (await page.locator('.demo-strip').count()) throw new Error('Live build must not enable demo');
  // Prompt-mode workers activate on first visit and control after navigation.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 15000 });
  const manifest = await (
    await page.request.get('http://127.0.0.1:4173/manifest.webmanifest')
  ).json();
  if (manifest.name !== 'Boardgame Advisor') throw new Error('Missing manifest');
  const cached = await page.evaluate(async () =>
    (
      await Promise.all(
        (await caches.keys()).map(async (key) =>
          (await (await caches.open(key)).keys()).map((request) => request.url),
        ),
      )
    ).flat(),
  );
  if (cached.some((url) => new URL(url).pathname.startsWith('/api/')))
    throw new Error('API data must not be cached');
  await page.context().setOffline(true);
  await page.reload();
  await page.getByRole('heading', { name: /Tối nay/ }).waitFor();
  if (await page.getByTestId('game-card').count())
    throw new Error('Offline live build must not silently use mock games');
  console.log(
    `Live PWA: manifest, controller, offline shell; ${cached.length} cached assets; zero API cache and no demo fallback.`,
  );
  await page.close();
  const demo = await browser.newPage();
  await demo.goto('http://127.0.0.1:4174/games');
  await demo.getByTestId('game-card').first().waitFor();
  if (!(await demo.locator('.demo-strip').count())) throw new Error('Demo label is missing');
  console.log('Production demo: MSW runs, labeled catalog loads.');
} finally {
  await browser.close();
}
