# 🎯 Visual Testing for Dynamic Dashboards

## Overview
This documentation covers visual regression testing for dashboards with dynamic, real-time data. Our approach focuses on **UI structure and layout consistency** rather than exact data values.

## 🚀 Key Principles

### 1. **Mask Dynamic Content**
Instead of testing exact values, we mask dynamic content to test layout:
- ✅ Currency amounts (`$1,234`)
- ✅ Percentages (`+15%`, `-5%`)
- ✅ Dates and times
- ✅ Chart data visualization
- ✅ Real-time metrics

### 2. **Focus on Structure Over Data**
- Layout consistency
- Component positioning
- Responsive behavior
- Color schemes and themes
- Interactive element presence

### 3. **Higher Tolerance for Visual Differences**
- Threshold set to 0.3 (30%) to handle dynamic content changes
- MaxDiffThreshold at 0.5-0.6 for flexibility

## 📁 Test Structure

```
tests/visual/
├── dashboard.spec.ts        # Full dashboard layout tests
├── components.spec.ts       # Individual component tests
└── helpers/
    └── test-utils.ts       # Shared utilities and masking helpers
```

## 🛠️ Available Test Commands

```bash
# Run all visual tests
yarn playwright

# Run with UI for debugging
yarn playwright:ui

# Update visual baselines when layouts change
yarn playwright:update

# Run specific test file
npx playwright test tests/visual/dashboard.spec.ts
```

## 🎨 Test Types

### 1. **Layout Structure Tests**
Test overall dashboard layout with dynamic content masked:
```typescript
test('dashboard layout structure', async ({ page }) => {
  await expect(page).toHaveScreenshot('layout.png', 
    SCREENSHOT_OPTIONS.fullPage(page)
  );
});
```

### 2. **Responsive Tests**
Test layout adaptation across different screen sizes:
```typescript
test('mobile layout', async ({ page }) => {
  await setViewportAndReload(page, 'mobile');
  await expect(page).toHaveScreenshot('mobile-layout.png', 
    SCREENSHOT_OPTIONS.withMasks(page)
  );
});
```

### 3. **Component Presence Tests**
Verify components exist without visual comparison:
```typescript
test('components exist', async ({ page }) => {
  await expect(page.locator('[data-testid="metric-card"]')).toBeVisible();
  const cardCount = await page.locator('.metric-card').count();
  expect(cardCount).toBeGreaterThan(0);
});
```

### 4. **Error & Loading State Tests**
Test graceful degradation:
```typescript
test('error state handling', async ({ page }) => {
  await simulateAPIFailures(page);
  await page.reload();
  await expect(page.locator('body')).toBeVisible(); // Page doesn't crash
});
```

## 🎯 What We Test

### ✅ **Layout & Structure**
- Header/navigation positioning
- Sidebar layout
- Grid layouts for metric cards
- Chart container placement
- Footer positioning

### ✅ **Responsive Behavior**
- Mobile (375px): Stack layout, collapsed navigation
- Tablet (768px): Grid adjustments, touch-friendly spacing
- Desktop (1200px+): Full layout, hover states

### ✅ **Theme & Visual Consistency**
- Dark/light mode switching
- Color scheme consistency
- Typography rendering
- Icon positioning

### ✅ **Interactive Elements**
- Button presence and hover states
- Form input accessibility
- Navigation functionality
- Modal/dropdown positioning

## ❌ **What We Don't Test**

### ❌ **Dynamic Data Values**
- Specific dollar amounts
- Exact percentages
- Live chart data points
- Real-time timestamps

### ❌ **User-Generated Content**
- Variable text lengths
- Dynamic lists with changing content
- API-dependent data variations

## 🔧 Configuration

### Playwright Config Highlights
```typescript
expect: {
  threshold: 0.3,           // 30% difference tolerance
  toHaveScreenshot: {
    threshold: 0.3,
    maxDiffThreshold: 0.5,  // 50% max difference
    animations: 'disabled', // Consistent screenshots
  },
}
```

### Common Masking Patterns
```typescript
const DYNAMIC_CONTENT_SELECTORS = {
  numbers: 'text=/^\\$?\\d+[k|M|B]?/',
  percentages: 'text=/^\\+?\\-?\\d+%/',
  charts: '.recharts-wrapper, canvas, svg',
  dates: 'text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/',
};
```

## 🐛 Debugging Failed Tests

### 1. **View Test Results**
```bash
npx playwright show-report
```

### 2. **Update Baselines** (when layout actually changes)
```bash
npx playwright test --update-snapshots
```

### 3. **Interactive Debugging**
```bash
npx playwright test --debug
```

### 4. **Check for Unmasked Dynamic Content**
Look for:
- Numbers that should be masked
- Timestamps affecting layout
- Chart animations not disabled
- Loading states captured mid-transition

## 🚨 Common Issues & Solutions

### Issue: Tests failing due to numbers changing
**Solution**: Add number patterns to mask array
```typescript
mask: [
  page.locator('text=/^\\$\\d+/'),  // Currency
  page.locator('text=/^\\d+%/'),   // Percentages
]
```

### Issue: Charts causing test failures
**Solution**: Mask entire chart containers
```typescript
mask: [
  page.locator('.recharts-wrapper'),
  page.locator('canvas'),
  page.locator('svg'),
]
```

### Issue: Loading states captured inconsistently
**Solution**: Wait for stable state or test loading separately
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Additional stability wait
```

### Issue: Responsive tests inconsistent
**Solution**: Use viewport utilities and reload
```typescript
await setViewportAndReload(page, 'mobile');
```

## 📊 Test Coverage Strategy

### **Critical Path Testing**
1. ✅ Dashboard loads and displays layout
2. ✅ Metric cards are positioned correctly
3. ✅ Navigation is accessible
4. ✅ Charts containers render (data masked)
5. ✅ Responsive layouts work across devices

### **Edge Case Testing**
1. ✅ Error states don't break layout
2. ✅ Loading states maintain structure
3. ✅ Empty data states handled gracefully
4. ✅ Theme switching preserves layout

## 🔄 Maintenance

### **When to Update Baselines**
- ✅ Intentional layout changes
- ✅ New components added
- ✅ Theme/styling updates
- ✅ Responsive breakpoint changes

### **When NOT to Update Baselines**
- ❌ Data values changed
- ❌ Charts show different data
- ❌ Metrics show different numbers
- ❌ Timestamps are different

## 🎯 Success Metrics

### **Test Stability**
- Tests pass consistently regardless of data changes
- False positives minimized through proper masking
- True layout issues caught effectively

### **Coverage**
- All major layout components tested
- Responsive breakpoints covered
- Error states verified
- Theme variations tested

### **Maintainability**
- Helper utilities reduce test duplication
- Clear documentation for new team members
- Consistent patterns across test files

# Visual Regression Testing Guide

This document outlines the comprehensive visual testing setup for the coaching dashboard project, including Jest snapshots, Playwright visual tests, and Storybook component testing.

## 📚 Overview

Our visual testing strategy consists of three layers:

1. **Jest Snapshots** - Component structure and content verification
2. **Playwright Visual Tests** - Full page and application flow screenshots  
3. **Storybook Visual Tests** - Individual component visual regression testing
4. **Chromatic** - Automated visual testing for Storybook components

## 🚀 Quick Start

### Run All Visual Tests
```bash
yarn visual
```

### Run Specific Test Types
```bash
yarn visual:snapshots    # Jest snapshot tests
yarn visual:playwright   # Full page visual tests
yarn visual:storybook    # Storybook component tests
yarn visual:chromatic    # Chromatic visual tests
yarn visual:update       # Update all baselines
yarn visual:report       # View test reports
```

## 🧪 Test Types

### 1. Jest Snapshot Tests

**Purpose**: Verify component structure and content hasn't changed unexpectedly.

**Location**: `src/components/__tests__/*.snapshot.test.tsx`

**What they test**:
- Component render output
- Props handling
- Conditional rendering
- Class names and attributes

**Example**:
```typescript
it('should match snapshot for basic metric card', () => {
  const { container } = render(
    <MetricCard title="Total Views" value={125000} />
  );
  expect(container.firstChild).toMatchSnapshot();
});
```

**Running**:
```bash
yarn visual:snapshots
```

### 2. Playwright Visual Tests

**Purpose**: Capture full page screenshots and test user interactions.

**Location**: `tests/visual/dashboard.spec.ts`

**What they test**:
- Full dashboard layouts
- Dark/light theme variations
- Responsive design (mobile, tablet, desktop)
- Loading and error states
- User interaction flows

**Running**:
```bash
# Ensure dashboard is running: yarn dev
yarn visual:playwright
```

### 3. Storybook Component Tests  

**Purpose**: Test isolated components in various states using Storybook.

**Location**: `tests/visual/components.spec.ts`

**What they test**:
- Component variants and states
- Props combinations
- Hover and focus states
- Responsive behavior

**Running**:
```bash
# Ensure Storybook is running: yarn storybook
yarn visual:storybook
```

### 4. Chromatic Integration

**Purpose**: Automated visual testing and review workflow.

**Setup**:
1. Sign up at [chromatic.com](https://www.chromatic.com/)
2. Create a project and get your project token
3. Set environment variable: `CHROMATIC_PROJECT_TOKEN=your_token`

**Running**:
```bash
yarn visual:chromatic
```

## 📸 Visual Test Configuration

### Playwright Configuration

The Playwright config (`playwright.config.ts`) includes:

- **Multiple browsers**: Chrome, Firefox, Safari
- **Mobile testing**: Pixel 5, iPhone 12
- **Visual thresholds**: 0.2 threshold for visual diffs
- **Animation handling**: Disabled for consistent screenshots
- **Automatic server startup**: Starts Next.js dev server

### Screenshot Naming Convention

```
tests/visual/dashboard-{test-name}-{browser}.png
tests/visual/components-{component}-{variant}-{browser}.png
```

## 🔧 Updating Visual Baselines

When you intentionally change component appearance:

```bash
yarn visual:update
```

This will:
- Update Jest snapshots
- Update Playwright screenshots
- Reset visual baselines

## 🐛 Debugging Visual Test Failures

### 1. View Visual Differences

```bash
yarn visual:report
```

This opens the Playwright HTML report showing:
- Side-by-side comparisons
- Diff highlighting
- Test execution details

### 2. Interactive Debugging

```bash
yarn playwright:ui
```

Opens Playwright's UI mode for interactive debugging.

### 3. Debug Mode

```bash
yarn playwright:debug
```

Runs tests in debug mode with browser DevTools.

## 📁 File Structure

```
├── tests/visual/                 # Playwright visual tests
│   ├── dashboard.spec.ts         # Full page tests
│   └── components.spec.ts        # Component-specific tests
├── scripts/
│   └── visual-tests.js           # Test orchestration script
├── src/components/__tests__/
│   ├── *.snapshot.test.tsx       # Jest snapshot tests
│   └── __snapshots__/            # Generated snapshots
├── test-results/                 # Playwright test results
├── playwright.config.ts          # Playwright configuration
└── docs/VISUAL_TESTING.md        # This documentation
```

## 🎯 Best Practices

### 1. Writing Visual Tests

- **Test key user journeys** in full page tests
- **Test component variants** in isolation using Storybook
- **Use data-testid** attributes for stable selectors
- **Wait for animations** to complete before screenshots
- **Test responsive breakpoints** explicitly

### 2. Managing Test Stability

- **Disable animations** in visual tests
- **Use consistent data** to avoid flaky tests
- **Set proper timeouts** for dynamic content
- **Mock external API calls** when needed

### 3. Review Process

1. **Run tests locally** before committing
2. **Review visual changes** in CI/CD pipeline
3. **Update baselines** only when changes are intentional
4. **Use Chromatic reviews** for team collaboration

## 🚨 Common Issues

### Tests Failing Due to Font Rendering
- Ensure consistent fonts across environments
- Consider using web-safe fonts for testing

### Animation Inconsistencies
- Disable animations in test environment
- Use `waitForTimeout` for dynamic content

### Server Not Running
- The visual test script checks if servers are running
- Start `yarn dev` and `yarn storybook` before running tests

### Environment Differences
- Use consistent viewport sizes
- Standardize browser versions in CI
- Consider using Docker for consistent environments

## 📊 Metrics and Reporting

### Test Coverage
Track visual test coverage by:
- Components with visual tests
- User journeys tested
- Browser/device combinations

### Performance
Monitor test execution time:
- Snapshot tests: < 1 second
- Playwright tests: < 30 seconds per test
- Full visual suite: < 5 minutes

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Visual Tests
  run: |
    yarn install
    yarn build
    yarn visual:snapshots
    yarn start &
    yarn storybook &
    sleep 10
    yarn visual:playwright
    yarn visual:storybook
```

### Chromatic Integration
```yaml
- name: Chromatic Visual Tests
  run: yarn visual:chromatic
  env:
    CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## 📞 Support

For issues with visual testing:

1. Check this documentation
2. Review test output and error messages
3. Use `yarn visual:report` for detailed failure analysis
4. Check Storybook and dashboard are running for component tests

---

*Last updated: [Current Date]* 