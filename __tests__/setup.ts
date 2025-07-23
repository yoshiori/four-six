// Jest setup for jsdom environment

// Mock console.warn to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
};

// Setup DOM globals if needed
Object.defineProperty(global, 'Node', {
  value: {
    TEXT_NODE: 3,
    ELEMENT_NODE: 1,
  },
});

// Mock IntersectionObserver if needed for future tests
(global as { IntersectionObserver: unknown }).IntersectionObserver =
  class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];

    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  };

// Mock localStorage for all tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as jest.Mocked<Storage>;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Export for use in tests
(
  global as unknown as { localStorageMock: jest.Mocked<Storage> }
).localStorageMock = localStorageMock;
