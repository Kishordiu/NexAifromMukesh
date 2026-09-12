# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> DiuMed Admin Panel >> Admin can navigate to domains and organisers
- Location: e2e\admin.spec.js:32:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('DiuMed Admin Panel', () => {
  4  | 
> 5  |   test.beforeEach(async ({ page }) => {
     |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  6  |     // Login as Admin
  7  |     await page.goto('/login');
  8  |     // Using an admin test account (requires seeding or mocking in real CI)
  9  |     await page.fill('input[type="email"]', 'admin@diumed.app');
  10 |     await page.fill('input[type="password"]', 'admin123');
  11 |     
  12 |     // We mock the API response for auth to simulate admin privileges
  13 |     await page.route('**/api/auth/login', async route => {
  14 |       await route.fulfill({
  15 |         status: 200,
  16 |         json: { token: 'fake-admin-token', user: { id: 'admin1', email: 'admin@diumed.app', role: 'ADMIN' } }
  17 |       });
  18 |     });
  19 | 
  20 |     await page.route('**/api/patient/profile', async route => {
  21 |       await route.fulfill({ status: 200, json: { name: 'Admin User' } });
  22 |     });
  23 | 
  24 |     await page.route('**/api/patient/measurements', async route => {
  25 |       await route.fulfill({ status: 200, json: [] });
  26 |     });
  27 | 
  28 |     await page.click('button[type="submit"]');
  29 |     await page.waitForURL('/home');
  30 |   });
  31 | 
  32 |   test('Admin can navigate to domains and organisers', async ({ page }) => {
  33 |     // Navigate to Admin dashboard via URL since it's hidden on standard mobile layout without sidebar
  34 |     await page.goto('/admin');
  35 |     await expect(page.locator('h1')).toContainText('Admin Console');
  36 | 
  37 |     // Check Domains module
  38 |     await page.click('text=Manage Domains');
  39 |     await expect(page.locator('h1')).toContainText('Manage Domains');
  40 |     
  41 |     // Navigate back to Admin
  42 |     await page.goto('/admin');
  43 | 
  44 |     // Check Organisers module
  45 |     await page.click('text=Manage Organisers');
  46 |     await expect(page.locator('h1')).toContainText('Manage Organisers');
  47 |   });
  48 | });
  49 | 
```