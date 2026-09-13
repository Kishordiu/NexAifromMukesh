import { test, expect } from '@playwright/test';

test.describe('DiuMed Core Flows', () => {
  
  test('Login and view dashboard', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) });
    page.on('pageerror', exception => errors.push(exception.message));

    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        json: { token: 'fake-patient-token', user: { id: 'patient1', email: 'patient@diumed.app', role: 'PATIENT' } }
      });
    });

    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        json: { user: { id: 'patient1', email: 'patient@diumed.app', role: 'PATIENT' } }
      });
    });

    await page.route('**/api/patient/profile', async route => {
      await route.fulfill({ status: 200, json: { name: 'Patient Test' } });
    });

    await page.route('**/api/patient/measurements', async route => {
      await route.fulfill({ status: 200, json: [] });
    });
    
    await page.route('**/api/domains', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/api/organisers', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    // Navigate to login
    await page.goto('/login');
    
    // Expect the login page to have the Welcome Back title
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Fill credentials
    await page.fill('input[type="email"]', 'patient@diumed.app');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    // Wait for navigation to home
    await page.waitForURL('**/home');
    
    // The DiuMed branding or some dashboard specific text should be visible
    // We'll check for something that appears on MotherDashboard (PatientDashboard)
    await expect(page.locator('text=DiuMed')).toBeVisible();
    await expect(page.locator('text=Heart Rate')).toBeVisible();

    // Take a screenshot of the main dashboard for visual regression
    await page.screenshot({ path: 'e2e/screenshots/dashboard.png', fullPage: true });

    expect(errors, `Found console errors: ${errors.join(', ')}`).toHaveLength(0);
  });

});
