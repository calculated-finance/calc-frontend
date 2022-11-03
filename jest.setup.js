import 'jest-canvas-mock';

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

const originalConsoleError = global.console.error;

global.console.error = (error) => {
  error.toString() === 'Error: test reason' || error.toString() === 'Error: Query data cannot be undefined'
    ? null
    : originalConsoleError(error);
};

jest.setTimeout(10000);
