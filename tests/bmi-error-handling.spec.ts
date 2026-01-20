import { test, expect } from '@playwright/test';

const EXISTING_USER = `user_error_${Date.now()}`;
const PASSWORD = 'password123';

test.describe.serial('BMI Web Application Error Handling Tests', () => {

  test.beforeAll(async ({ browser }) => {
    // Create a user to test duplicate registration and login
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="username"]', EXISTING_USER);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/login/);
    await page.close();
  });

  test('Case 6: Register with existing username', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="username"]', EXISTING_USER);
    await page.fill('input[name="password"]', 'newpassword');
    
    await page.click('button[type="submit"]');
    
    // Should see error message (div with text-red-500)
    await expect(page.locator('.text-red-500')).toContainText('Username already exists');
  });

  test('Case 7: Login with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', EXISTING_USER);
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should see error message
    const errorLocator = page.locator('.text-red-500, .error-message, [role="alert"]');
    await expect(errorLocator).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('Case 8: Login with non-existent user', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'non_existent_user_12345');
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    // Should see error message
    const errorLocator = page.locator('.text-red-500, .error-message, [role="alert"]');
    await expect(errorLocator).toBeVisible();
  });

});
