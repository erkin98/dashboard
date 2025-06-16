import { test, expect } from '@playwright/test';

test.describe('Component Visual Regression Tests', () => {
  const STORYBOOK_URL = 'http://localhost:6006';

  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for component testing
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test.describe('MetricCard Component', () => {
    test('metric card - default state', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--default`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-default.png');
    });

    test('metric card - with prefix and suffix', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--with-prefix-suffix`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-prefix-suffix.png');
    });

    test('metric card - with positive change', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--with-positive-change`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-positive-change.png');
    });

    test('metric card - with negative change', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--with-negative-change`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-negative-change.png');
    });

    test('metric card - with icon', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--with-icon`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-with-icon.png');
    });

    test('metric card - large numbers', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--large-numbers`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-large-numbers.png');
    });
  });

  test.describe('Button Component', () => {
    test('button - all variants', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--all-variants`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-all-variants.png');
    });

    test('button - all sizes', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--all-sizes`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-all-sizes.png');
    });

    test('button - destructive', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--destructive`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-destructive.png');
    });

    test('button - disabled state', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--disabled`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-disabled.png');
    });

    test('button - hover state', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--default`);
      await page.waitForLoadState('networkidle');
      
      const button = page.locator('button');
      await button.hover();
      await page.waitForTimeout(200); // Wait for hover animation
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-hover.png');
    });
  });

  test.describe('AIInsights Component', () => {
    test('ai insights - default state', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--default`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-default.png');
    });

    test('ai insights - empty state', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--empty-state`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-empty.png');
    });

    test('ai insights - high impact only', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--high-impact-only`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-high-impact.png');
    });

    test('ai insights - mixed impact levels', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--mixed-impact-levels`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-mixed-impact.png');
    });

    test('ai insights - single insight', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--single-insight`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-single.png');
    });

    test('ai insights - long content', async ({ page }) => {
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--long-content`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-long-content.png');
    });
  });

  test.describe('Responsive Component Tests', () => {
    test('metric card - mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-metriccard--full-example`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('metric-card-mobile.png');
    });

    test('button - mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=ui-button--all-variants`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('button-mobile.png');
    });

    test('ai insights - mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=components-aiinsights--default`);
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot('ai-insights-mobile.png');
    });
  });
}); 