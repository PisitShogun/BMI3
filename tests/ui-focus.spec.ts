import { test, expect } from '@playwright/test';

test.describe('UI Focus: Login & Weight Input', () => {
  // Generate unique credentials for this test run
  const username = `ui_user_${Date.now()}`;
  const password = 'password123';

  // Setup: Register user via API before running UI test
  // This allows us to focus strictly on Login and Weight Input UI
  test.beforeAll(async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/api/auth/register`, {
      data: { username, password }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('Focus: Login -> Input Weight -> Verify', async ({ page }) => {
    // --- Step 1: Login UI ---
    await page.goto('/login');
    
    // Fill credentials
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    
    // Click login
    await page.click('button[type="submit"]');
    
    // Verify redirection to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('BMI Dashboard');

    // --- Step 2: Weight Input UI ---
    // Wait for form to be ready
    await expect(page.locator('form')).toBeVisible();

    // Fill weight and height
    await page.fill('input[name="weight"]', '65.5');
    await page.fill('input[name="height"]', '170');

    // Verify inputs reflect user typing
    await expect(page.locator('input[name="weight"]')).toHaveValue('65.5');
    await expect(page.locator('input[name="height"]')).toHaveValue('170');

    // Submit calculation
    await page.click('button[type="submit"]');

    // --- Step 3: Verification ---
    // Check if result appears
    await expect(page.locator('text=Your BMI is')).toBeVisible();
    await expect(page.locator('.text-4xl')).not.toBeEmpty();
  });
});
