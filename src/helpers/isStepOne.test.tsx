export function mockIsStepOne(path: string) {
  if (path.includes('assets')) {
    return true;
  }
  return false;
}

describe('checks if step one', () => {
  it('returns true if step one', () => {
    const result = mockIsStepOne('assets');
    expect(result).toBe(true);
  });

  it('returns false if not step one', () => {
    const result = mockIsStepOne('customise');
    expect(result).toBe(false);
  });
});
