import 'jest-canvas-mock';
import { TextEncoder, TextDecoder } from 'util';

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

const originalConsoleError = global.console.error;

global.console.error = (error) => {
  error.toString() === 'Error: test reason' ||
  error.toString() === 'Error: Query data cannot be undefined' ||
  error.toString().includes('not wrapped in act') ||
  error.toString().includes(' not configured to support act')
    ? null
    : originalConsoleError(error);
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.setTimeout(10000);
