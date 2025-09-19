import { test, expect } from '@playwright/test';

const langs = ['en', 'zh-hans'] as const;

for (const lang of langs) {
  test(`homepage loads and header/nav present - ${lang}`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.getByRole('link', { name: 'Emoji Family' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Primary/i })).toBeVisible();
    await expect(page.getByRole('search')).toBeVisible();
  });
}

test('search suggestions navigate to emoji detail', async ({ page }) => {
  await page.goto('/en');
  // Type a query that should yield results
  await page.fill('#search-input', 'OK');
  const firstSuggestion = page.locator('ul[role="listbox"] a[href^="/en/emoji/"]').first();
  await expect(firstSuggestion).toBeVisible();
  const href = await firstSuggestion.getAttribute('href');
  await firstSuggestion.click();
  await expect(page).toHaveURL(/\/en\/emoji\//);
  expect(href).toContain('/en/emoji/');
});

