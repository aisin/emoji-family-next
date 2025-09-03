import { test, expect } from '@playwright/test';

const langs = ['en', 'zh-hans', 'zh-hant'] as const;

for (const lang of langs) {
  test(`homepage loads and header/nav present - ${lang}`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.getByRole('link', { name: 'Emoji Family' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Primary/i })).toBeVisible();
    await expect(page.getByRole('search')).toBeVisible();
  });
}

test('search results card navigates to detail', async ({ page }) => {
  await page.goto('/en/search?q=OK');
  const firstCard = page.locator('a.card').first();
  await expect(firstCard).toBeVisible();
  const href = await firstCard.getAttribute('href');
  expect(href).toContain('/en/emoji/');
});

