# Testing Setup and Installation Guide

## Required Dependencies

To run the tests, you need to install the following packages:

```powershell
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Package Details

- **vitest** - Fast unit test framework (Vite-native alternative to Jest)
- **@vitest/ui** - Optional UI for running and viewing tests
- **jsdom** - DOM implementation for Node.js (required for React component testing)
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction simulation

## Running Tests

After installing dependencies, you can run tests with:

```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Add to package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Coverage (Optional)

For code coverage reports, also install:

```powershell
npm install --save-dev @vitest/coverage-v8
```

## Test Files Created

The following test files have been created:

### Page Tests
1. **StartingPage.test.tsx** - Tests logo, text, and navigation buttons
2. **HomePage.test.tsx** - Tests user data fetching, stats display, and workouts
3. **HistoryPage.test.tsx** - Tests workout history display and interactions
4. **UserPage.test.tsx** - Tests user profile and statistics display
5. **SettingsPage.test.tsx** - Tests settings modals and user preferences
6. **StartWorkoutPage.test.tsx** - Tests workout launcher options
7. **RepeatWorkoutPage.test.tsx** - Tests workout selection and navigation
8. **LoginPage.test.tsx** - Tests login form and validation
9. **SignUpPage.test.tsx** - Tests signup form and validation

## Test Coverage

Each test file includes:
- ✅ Component rendering tests
- ✅ User interaction tests
- ✅ API call mocking and testing
- ✅ Error handling tests
- ✅ Loading state tests
- ✅ Navigation tests
- ✅ Form validation tests (where applicable)

## Configuration Files

- **vitest.config.ts** - Vitest configuration with jsdom environment
- **src/test/setup.ts** - Global test setup (mocks for matchMedia, IntersectionObserver, etc.)

## Notes

- Tests use mocked components for Header and other complex components to isolate testing
- API calls are mocked using `vi.mock()` to avoid real network requests
- React Router is wrapped with `BrowserRouter` in tests
- AuthContext is provided for pages that require authentication
