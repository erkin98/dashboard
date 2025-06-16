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