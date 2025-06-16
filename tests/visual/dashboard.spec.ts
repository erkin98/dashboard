import { test, expect } from '@playwright/test';

test.describe('Dashboard Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
  });

  test('dashboard homepage - full page', async ({ page }) => {
    // Take full page screenshot
    await expect(page).toHaveScreenshot('dashboard-homepage-full.png', {
      fullPage: true,
    });
  });

  test('dashboard homepage - viewport', async ({ page }) => {
    // Take viewport screenshot
    await expect(page).toHaveScreenshot('dashboard-homepage-viewport.png');
  });

  test('dashboard homepage - dark mode', async ({ page }) => {
    // Toggle to dark mode (if there's a theme toggle)
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }
    
    await expect(page).toHaveScreenshot('dashboard-homepage-dark.png');
  });

  test('dashboard with data loaded', async ({ page }) => {
    // Wait for data to load (look for metric cards or charts)
    await page.waitForSelector('[data-testid="metric-card"]', { timeout: 10000 }).catch(() => {
      // If no data-testid, wait for common dashboard elements
      return page.waitForSelector('.bg-slate-900', { timeout: 5000 });
    });
    
    await expect(page).toHaveScreenshot('dashboard-with-data.png', {
      fullPage: true,
    });
  });

  test('dashboard - responsive mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
    });
  });

  test('dashboard - tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
    });
  });

  test('dashboard - error state', async ({ page }) => {
    // Intercept API calls and make them fail
    await page.route('/api/dashboard', route => route.abort());
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Wait for error state to appear
    await page.waitForSelector('text=Failed to load', { timeout: 10000 }).catch(() => {
      // If no specific error text, wait a bit for error state
      return page.waitForTimeout(2000);
    });
    
    await expect(page).toHaveScreenshot('dashboard-error-state.png');
  });

  test('dashboard - loading state', async ({ page }) => {
    // Intercept API to delay response
    await page.route('/api/dashboard', route => {
      setTimeout(() => route.continue(), 3000);
    });
    
    await page.reload();
    
    // Take screenshot during loading
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('dashboard-loading-state.png');
  });
}); 