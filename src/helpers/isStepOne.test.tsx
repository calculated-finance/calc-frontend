export const mockRouterAssets = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/assets',
  query: { id: '1', chain: 'Kujira' },
  events: {
    on: jest.fn(),
  },
};
jest.mock('next/router', () => ({
  useRouter() {
    return mockRouterAssets;
  },
}));

export const mockRouterCustomise = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/customise',
  query: { id: '1', chain: 'Kujira' },
  events: {
    on: jest.fn(),
  },
};
jest.mock('next/router', () => ({
  useRouter() {
    return mockRouterCustomise;
  },
}));

export function mockIsStepOne(path: string) {
  if (path.includes('assets')) {
    return true;
  }
  return false;
}

describe('checks if step one', () => {
  it('returns true if step one', () => {
    const result = mockIsStepOne(mockRouterAssets.pathname);
    expect(result).toBe(true);
  });

  it('returns false if not step one', () => {
    const result = mockIsStepOne(mockRouterCustomise.pathname);
    expect(result).toBe(false);
  });
});
