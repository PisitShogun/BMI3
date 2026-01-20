import { test, expect } from '@playwright/test';

const TEST_USER = `user_${Date.now()}`;
const TEST_PASS = 'password123';

test.describe.serial('BMI Web Application E2E Tests', () => {
  
  test('Case 1: Register a new user', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="username"]', TEST_USER);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]');

    // Should redirect to login page or show success
    await expect(page).toHaveURL(/login/);
  });

  test('Case 2: Login with registered user', async ({ page }) => {
    // Ensure we are on login page
    await page.goto('/login');
    await page.fill('input[name="username"]', TEST_USER);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('BMI Dashboard');
  });

  test('Case 3: Calculate BMI', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', TEST_USER);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Input weight and height
    await page.fill('input[name="weight"]', '70'); // 70 kg
    await page.fill('input[name="height"]', '175'); // 175 cm
    await page.click('button[type="submit"]');

    // Verify Result (70 / 1.75^2 = 22.86)
    await expect(page.locator('text=Your BMI is')).toBeVisible();
    await expect(page.locator('.text-4xl')).toContainText('22.86');
    await expect(page.locator('.text-green-500')).toContainText('Normal weight');
  });

  test('Case 4: Check History', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', TEST_USER);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Check if the history list contains the record we just added
    // Refresh page to ensure history is fetched
    await page.reload();
    
    // We expect to see the weight and BMI in the list (Table)
    // Note: Database might return 70.00 instead of 70
    await expect(page.locator('table')).toContainText('70.00 kg');
    await expect(page.locator('table')).toContainText('22.86');
  });

  test('Case 5: Logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', TEST_USER);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Click logout
    await page.click('button:has-text("Logout")');

    // Should redirect to login page
    await expect(page).toHaveURL(/login/);
    
    // Try to access dashboard again - should be redirected to login (if middleware works)
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

});
