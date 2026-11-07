import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page) {
  await page.goto('/games');
  await expect(page.getByTestId('game-card').first()).toBeVisible();
}
test('filters across the catalog, preserves URL and navigates details', async ({
  page,
  isMobile,
}) => {
  await ready(page);
  if (isMobile) await page.getByRole('button', { name: 'Bộ lọc', exact: true }).click();
  await page.getByLabel('Số người', { exact: true }).selectOption('4');
  await page.getByLabel('Thời gian', { exact: true }).selectOption('30');
  await page.getByRole('button', { name: 'Áp dụng', exact: true }).click();
  await expect(page).toHaveURL(/players=4&time=30/);
  await expect(page.getByRole('heading', { name: 'Đêm Kể Chuyện', exact: true })).toBeVisible();
  await expect(page.getByTestId('game-card')).toHaveCount(6);
  await page.reload();
  await expect(page.getByTestId('game-card')).toHaveCount(6);
  await page.getByRole('link', { name: 'Xem Đảo Mây', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Đảo Mây', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Làm quen luật' })).toBeVisible();
});
test('guest wishlist survives reload and can be edited from the shelf', async ({ page }) => {
  await ready(page);
  const heart = page.getByRole('button', { name: 'Muốn thử Đảo Mây', exact: true });
  await expect(heart).toBeEnabled();
  await heart.click();
  await expect(
    page.getByRole('button', { name: 'Bỏ muốn thử Đảo Mây', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/library');
  await expect(page.getByRole('heading', { name: 'Đảo Mây', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Đảo Mây', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Chỉnh sửa Đảo Mây' }).click();
  await page.getByLabel('Đang sở hữu', { exact: true }).check();
  await page.getByRole('button', { name: 'Chấm 4 sao', exact: true }).click();
  await page.getByRole('button', { name: 'Lưu vào kệ', exact: true }).click();
  await expect(page.getByText('★ 4/5', { exact: true })).toBeVisible();
});
test('recommendation honors constraints and does not fabricate candidates', async ({ page }) => {
  await page.goto('/recommend');
  await page.getByLabel('Mô tả buổi chơi').fill('4 người, 30 phút, thích hợp tác');
  await page.getByRole('button', { name: 'Tìm game phù hợp', exact: true }).click();
  await expect(page.getByTestId('game-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Đảo Mây', exact: true })).toBeVisible();
  await page.getByLabel('Mô tả buổi chơi').fill('20 người, 5 phút');
  await page.getByRole('button', { name: 'Tìm game phù hợp', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Chưa có game đáp ứng đủ điều kiện' }),
  ).toBeVisible();
});
test('failed guest merge preserves local data, successful retry merges once', async ({ page }) => {
  await ready(page);
  const heart = page.getByRole('button', { name: 'Muốn thử Đảo Mây', exact: true });
  await expect(heart).toBeEnabled();
  await heart.click();
  await expect(
    page.getByRole('button', { name: 'Bỏ muốn thử Đảo Mây', exact: true }),
  ).toBeVisible();
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('demo@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('sample123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.evaluate(() => sessionStorage.setItem('bga-demo-scenario', 'error'));
  await page.getByRole('button', { name: 'Gộp vào tài khoản', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('bga-demo-scenario'));
  await page.getByRole('button', { name: 'Gộp vào tài khoản', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByTestId('game-card')).toHaveCount(1);
  await page.reload();
  await expect(page.getByTestId('game-card')).toHaveCount(1);
});
test('error and quota states keep the input and allow recovery', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => sessionStorage.setItem('bga-demo-scenario', 'error'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Có một chút gián đoạn' })).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('bga-demo-scenario'));
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.getByTestId('game-card').first()).toBeVisible();
  await page.goto('/recommend');
  await page.evaluate(() => sessionStorage.setItem('bga-demo-scenario', 'rate-limit'));
  await page.getByLabel('Mô tả buổi chơi').fill('4 người, 30 phút');
  await page.getByRole('button', { name: 'Tìm game phù hợp', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('giới hạn');
  await expect(page.getByLabel('Mô tả buổi chơi')).toHaveValue('4 người, 30 phút');
});
test('layouts fit the viewport and details are reachable directly', async ({ page }, testInfo) => {
  await ready(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: `test-results/discover-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto('/games/dao-may/learn');
  await expect(
    page.getByRole('heading', { name: 'Làm quen với Đảo Mây', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText('Chuẩn bị bàn chơi', { exact: true })).toBeVisible();
});

test('expired session permits reauthentication and retains the input', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('expired@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('sample123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kệ game của tôi', exact: true })).toBeVisible();
  await page.goto('/games/dao-may');
  const save = page.getByRole('button', { name: 'Lưu & chấm điểm', exact: true });
  await expect(save).toBeEnabled();
  await save.click();
  await page.getByLabel('Ghi chú nhỏ').fill('Giữ lại khi phiên hết hạn');
  await page.evaluate(() => sessionStorage.removeItem('bga-demo-user'));
  await page.getByRole('button', { name: 'Lưu vào kệ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('hết hạn');
  await expect(page.getByLabel('Ghi chú nhỏ')).toHaveValue('Giữ lại khi phiên hết hạn');
  await page.getByRole('button', { name: 'Đóng hộp thoại' }).click();
  await page.goto('/login');
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
});

test('navigation works with keyboard on desktop and mobile', async ({ page, isMobile }) => {
  await ready(page);
  if (isMobile) {
    const trigger = page.getByRole('button', { name: 'Mở menu' });
    await trigger.click();
    await expect(
      page.getByRole('complementary').getByRole('button', { name: 'Đóng menu', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
  }
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Gợi ý cho bạn' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Kể mình nghe, bạn muốn chơi gì?' }),
  ).toBeVisible();
  if (isMobile)
    await expect(page.getByRole('button', { name: 'Mở menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
});
