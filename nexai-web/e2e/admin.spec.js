import { test, expect } from '@playwright/test';

test.describe('DiuMed Admin Panel', () => {

  test('Admin can navigate to domains and organisers', async ({ page }) => {
    // We mock the API response for auth to simulate admin privileges
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        json: { token: 'fake-admin-token', user: { id: 'admin1', email: 'admin@diumed.app', role: 'ADMIN' } }
      });
    });

    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        json: { user: { id: 'admin1', email: 'admin@diumed.app', role: 'ADMIN' } }
      });
    });

    await page.route('**/api/patient/profile', async route => {
      await route.fulfill({ status: 200, json: { name: 'Admin User' } });
    });

    await page.route('**/api/patient/measurements', async route => {
      await route.fulfill({ status: 200, json: [] });
    });
    
    // Also mock Domains and Organisers fetching so the page doesn't crash if it tries to load them
    await page.route('**/api/domains', async route => {
      await route.fulfill({ status: 200, json: [] });
    });
    await page.route('**/api/organisers', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    // Login as Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@diumed.app');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for the home page to load first, ensuring auth state is populated
    await page.waitForURL('**/home');

    // Now click the Admin link or navigate to /admin
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Admin Console');

    // Check Domains module
    await page.click('text=Manage Domains');
    await expect(page.locator('h1')).toContainText('Manage Domains');
    
    // Navigate back to Admin
    await page.goto('/admin');

    // Check Organisers module
    await page.click('text=Manage Organisers');
    await expect(page.locator('h1')).toContainText('Manage Organisers');
  });
});
