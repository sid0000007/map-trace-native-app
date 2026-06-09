/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Collect coverage from the domain + lib layers (screens/components tested separately in Phase 4).
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
