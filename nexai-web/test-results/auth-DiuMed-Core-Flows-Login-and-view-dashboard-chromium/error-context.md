# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> DiuMed Core Flows >> Login and view dashboard
- Location: e2e\auth.spec.js:5:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "DiuMed"
Received string:    "Welcome Back"
Timeout: 5000ms

Call log:
  - Expect "toContainText" locator('h1') with timeout 5000ms
  - waiting for locator('h1')
    6 × locator resolved to <h1 class="text-2xl font-bold text-center text-slate-800">Welcome Back</h1>
      - unexpected value "Welcome Back"

```

```yaml
- heading "Welcome Back" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('DiuMed Core Flows', () => {
  4  |   
  5  |   test('Login and view dashboard', async ({ page }) => {
  6  |     // Navigate to login
  7  |     await page.goto('/login');
  8  |     
  9  |     // Expect the login page to have the DiuMed branding
> 10 |     await expect(page.locator('h1')).toContainText('DiuMed');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  11 |     
  12 |     // Fill credentials
  13 |     await page.fill('input[type="email"]', 'patient@diumed.app');
  14 |     await page.fill('input[type="password"]', 'demo123');
  15 |     await page.click('button[type="submit"]');
  16 | 
  17 |     // Wait for navigation to home
  18 |     await page.waitForURL('/home');
  19 |     
  20 |     // Expect Dashboard elements
  21 |     await expect(page.locator('text=Current Status')).toBeVisible();
  22 |     await expect(page.locator('text=Heart Rate')).toBeVisible();
  23 |     await expect(page.locator('text=Blood Pressure')).toBeVisible();
  24 | 
  25 |     // Take a screenshot of the main dashboard for visual regression
  26 |     await page.screenshot({ path: 'e2e/screenshots/dashboard.png', fullPage: true });
  27 |   });
  28 | 
  29 | });
  30 | 
```