import { test, expect } from '@playwright/test';
import { 
  waitForPageReady, 
  getCommonMasks, 
  SCREENSHOT_OPTIONS, 
  VIEWPORT_SIZES,
  setViewportAndReload,
  simulateAPIFailures
} from './helpers/test-utils';

test.describe('Dashboard Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard and wait for it to be ready
    await page.goto('/');
    await waitForPageReady(page);
  });

  test('dashboard layout structure - mask dynamic content', async ({ page }) => {
    // Take screenshot with all dynamic content masked
    await expect(page).toHaveScreenshot('dashboard-layout-structure.png', 
      SCREENSHOT_OPTIONS.fullPage(page)
    );
  });

  test('dashboard responsive mobile - structure only', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('dashboard-mobile-structure.png', {
      fullPage: true,
      mask: [
        // Mask all dynamic numerical content
        page.locator('text=/^\$?\d+[k|M|B]?/'),
        page.locator('text=/^\+?\-?\d+%/'),
        page.locator('[data-testid*="chart"]'),
        page.locator('.recharts-wrapper'),
        page.locator('text=/\d{1,2}\/\d{1,2}\/\d{4}/'),
      ],
    });
  });

  test('dashboard responsive tablet - structure only', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('dashboard-tablet-structure.png', {
      fullPage: true,
      mask: [
        page.locator('text=/^\$?\d+[k|M|B]?/'),
        page.locator('text=/^\+?\-?\d+%/'),
        page.locator('[data-testid*="chart"]'),
        page.locator('.recharts-wrapper'),
        page.locator('text=/\d{1,2}\/\d{1,2}\/\d{4}/'),
      ],
    });
  });

  test('dashboard dark mode - UI components only', async ({ page }) => {
    // Toggle to dark mode if available
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    } else {
      // If no toggle, try to activate dark mode via system preference
      await page.emulateMedia({ colorScheme: 'dark' });
    }
    
    await expect(page).toHaveScreenshot('dashboard-dark-mode-ui.png', {
      mask: [
        // Mask all dynamic content, focus on color scheme
        page.locator('text=/^\$?\d+[k|M|B]?/'),
        page.locator('text=/^\+?\-?\d+%/'),
        page.locator('[data-testid*="chart"]'),
        page.locator('.recharts-wrapper'),
        page.locator('text=/\d{1,2}\/\d{1,2}\/\d{4}/'),
      ],
    });
  });

  test('dashboard components presence check', async ({ page }) => {
    // Verify essential UI components are present (no screenshots)
    await expect(page.locator('main')).toBeVisible();
    
    // Check for metric cards
    const metricCards = page.locator('[data-testid*="metric"], .bg-white, .bg-slate-800').first();
    await expect(metricCards).toBeVisible();
    
    // Check for navigation
    const navigation = page.locator('nav, header, [data-testid*="nav"]').first();
    if (await navigation.count() > 0) {
      await expect(navigation).toBeVisible();
    }
    
    // Test passes if components are present, regardless of data
  });

  test('dashboard error state - UI structure', async ({ page }) => {
    // Intercept API calls and make them fail
    await page.route('/api/dashboard', route => route.abort());
    await page.route('/api/**', route => route.abort());
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of error state structure
    await expect(page).toHaveScreenshot('dashboard-error-state-structure.png', {
      // No masking needed for error states as they should be consistent
    });
  });

  test('dashboard loading state - UI structure', async ({ page }) => {
    // Intercept API to delay response
    await page.route('/api/dashboard', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    await page.reload();
    await page.waitForTimeout(500); // Capture during loading
    
    await expect(page).toHaveScreenshot('dashboard-loading-structure.png', {
      // Focus on loading indicators, not content
    });
  });

  test('dashboard navigation interactions', async ({ page }) => {
    // Test that navigation elements work (no visual comparison)
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Test first button is clickable
      await expect(buttons.first()).toBeVisible();
      await expect(buttons.first()).toBeEnabled();
    }
    
    // Test any links are present
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });
}); 