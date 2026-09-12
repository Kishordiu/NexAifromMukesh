import { test, expect } from '@playwright/test';

test.describe('DiuMed Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('/login');
    // Using an admin test account (requires seeding or mocking in real CI)
    await page.fill('input[type="email"]', 'admin@diumed.app');
    await page.fill('input[type="password"]', 'admin123');
    
    // We mock the API response for auth to simulate admin privileges
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        json: { token: 'fake-admin-token', user: { id: 'admin1', email: 'admin@diumed.app', role: 'ADMIN' } }
      });
    });

    await page.route('**/api/patient/profile', async route => {
      await route.fulfill({ status: 200, json: { name: 'Admin User' } });
    });

    await page.route('**/api/patient/measurements', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.click('button[type="submit"]');
    await page.waitForURL('/home');
  });

  test('Admin can navigate to domains and organisers', async ({ page }) => {
    // Navigate to Admin dashboard via URL since it's hidden on standard mobile layout without sidebar
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
