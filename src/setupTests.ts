import '@testing-library/jest-dom';

// Mock import.meta.env for Jest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        DEV: process.env.NODE_ENV === 'development',
      },
    },
  },
  writable: true,
  configurable: true,
});
