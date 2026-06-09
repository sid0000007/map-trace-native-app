/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Only *.test.* are suites — helpers/mocks under __tests__ are not run directly.
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  // The Worker backend has its own (vitest) suite — keep it out of the app's jest run.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/backend/'],
  modulePathIgnorePatterns: ['<rootDir>/backend/'],
  // Collect coverage from the domain + lib layers (screens/components tested separately).
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  // Coverage targets for the layers the assignment calls out (≥80%).
  coverageThreshold: {
    './src/domains/locations/repositories/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/domains/locations/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/domains/locations/types/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/http/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
