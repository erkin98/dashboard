import { Page, Locator } from '@playwright/test';

/**
 * Common selectors for dynamic content that should be masked in visual tests
 */
export const DYNAMIC_CONTENT_SELECTORS = {
  // Numbers and currency
  numbers: 'text=/^\\$?\\d+[k|M|B]?/',
  percentages: 'text=/^\\+?\\-?\\d+%/',
  currency: 'text=/^\\$[\\d,]+/',
  
  // Dates and times
  dates: 'text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/',
  times: 'text=/\\d{1,2}:\\d{2}/',
  relativeTimes: 'text=/ago|yesterday|today/i',
  
  // Charts and dynamic content areas
  charts: '.recharts-wrapper, [data-testid*="chart"], canvas, svg',
  
  // Loading and dynamic states
  loading: '[data-testid*="loading"], .animate-spin, [aria-label*="loading" i]',
  
  // Metric values
  metricValues: '[data-testid*="metric-value"], .text-2xl, .text-3xl, .text-4xl',
};

/**
 * Get common mask locators for dynamic content
 */
export function getCommonMasks(page: Page): Locator[] {
  return [
    page.locator(DYNAMIC_CONTENT_SELECTORS.numbers),
    page.locator(DYNAMIC_CONTENT_SELECTORS.percentages),
    page.locator(DYNAMIC_CONTENT_SELECTORS.currency),
    page.locator(DYNAMIC_CONTENT_SELECTORS.dates),
    page.locator(DYNAMIC_CONTENT_SELECTORS.times),
    page.locator(DYNAMIC_CONTENT_SELECTORS.relativeTimes),
    page.locator(DYNAMIC_CONTENT_SELECTORS.charts),
  ];
}

/**
 * Get locators for chart-specific content to mask
 */
export function getChartMasks(page: Page): Locator[] {
  return [
    page.locator('.recharts-wrapper'),
    page.locator('canvas'),
    page.locator('svg'),
    page.locator('[data-testid*="chart"]'),
  ];
}

/**
 * Wait for page to be ready for visual testing
 */
export async function waitForPageReady(page: Page, options: {
  waitForSelector?: string;
  additionalWait?: number;
} = {}): Promise<void> {
  const { waitForSelector = 'main', additionalWait = 1000 } = options;
  
  await page.waitForLoadState('networkidle');
  
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout: 10000 });
  }
  
  // Additional wait for any remaining animations or content loading
  await page.waitForTimeout(additionalWait);
}

/**
 * Check if element exists and is visible without throwing
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector);
    const count = await element.count();
    if (count === 0) return false;
    
    return await element.first().isVisible();
  } catch {
    return false;
  }
}

/**
 * Get viewport configurations for responsive testing
 */
export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
  large: { width: 1920, height: 1080 },
};

/**
 * Set viewport and reload page for responsive testing
 */
export async function setViewportAndReload(
  page: Page, 
  size: keyof typeof VIEWPORT_SIZES
): Promise<void> {
  await page.setViewportSize(VIEWPORT_SIZES[size]);
  await page.reload();
  await waitForPageReady(page);
}

/**
 * Common screenshot options for consistent visual testing
 */
export const SCREENSHOT_OPTIONS = {
  // For layout/structure testing with dynamic content masked
  withMasks: (page: Page) => ({
    mask: getCommonMasks(page),
    threshold: 0.3,
    maxDiffThreshold: 0.5,
  }),
  
  // For testing static UI components
  static: {
    threshold: 0.2,
    maxDiffThreshold: 0.3,
  },
  
  // For full page testing
  fullPage: (page: Page) => ({
    fullPage: true,
    mask: getCommonMasks(page),
    threshold: 0.4,
    maxDiffThreshold: 0.6,
  }),
};

/**
 * Skip screenshot test if condition is met (e.g., no elements found)
 */
export function skipTestIf(condition: boolean, reason: string): void {
  if (condition) {
    console.log(`Skipping test: ${reason}`);
  }
}

/**
 * Simulate slow network for testing loading states
 */
export async function simulateSlowNetwork(page: Page): Promise<void> {
  await page.route('/api/**', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.continue();
  });
}

/**
 * Simulate API failures for error state testing
 */
export async function simulateAPIFailures(page: Page): Promise<void> {
  await page.route('/api/**', route => route.abort());
} 