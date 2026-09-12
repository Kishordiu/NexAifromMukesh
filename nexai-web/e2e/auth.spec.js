import { test, expect } from '@playwright/test';

test.describe('DiuMed Core Flows', () => {
  
  test('Login and view dashboard', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Expect the login page to have the DiuMed branding
    await expect(page.locator('h1')).toContainText('DiuMed');
    
    // Fill credentials
    await page.fill('input[type="email"]', 'patient@diumed.app');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    // Wait for navigation to home
    await page.waitForURL('/home');
    
    // Expect Dashboard elements
    await expect(page.locator('text=Current Status')).toBeVisible();
    await expect(page.locator('text=Heart Rate')).toBeVisible();
    await expect(page.locator('text=Blood Pressure')).toBeVisible();

    // Take a screenshot of the main dashboard for visual regression
    await page.screenshot({ path: 'e2e/screenshots/dashboard.png', fullPage: true });
  });

});
